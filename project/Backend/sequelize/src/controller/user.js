const { User, VerificationToken, Session } = require("../lib/sequelize");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const { generateToken, verifyToken } = require("../lib/jwt");
const Avatar = require("../model_mongo/avatarModel");
const sharp = require("sharp");
const mailer = require("../lib/mailer");
const mustache = require("mustache");
const { nanoid } = require("nanoid");
const moment = require("moment");
const fs = require("fs");

async function SendVerification(id, email, username) {
  const vertoken = await generateToken(
    { id, isEmailVerification: true },
    "600s" // mengatur lama waktu invalid token
  );
  const url_verify = process.env.LINK_VERIFY + vertoken;
  try {
    await mailer({
      to: email,
      subject: "Hi " + username + " please kindly verify your account",
      html: `<div> <h1> Your Account has been registered</h1> </div>
   <div> Please verify your account through this <a href="${url_verify}">Link</a></div>`,
    });
  } catch (err) {
    console.log(err);
    throw new Error(err.toString());
  }

  console.log("send ver");

  return vertoken;
}

const userController = {
  login: async (req, res) => {
    try {
      const { email, password, username, bio } = req.body;

      const user = await User.findOne({
        where: {
          [Op.or]: [{ username }, { email }],
        },
      });

      if (!user) {
        throw new Error("username/email/password not found");
      }

      const checkPass = await bcrypt.compareSync(password, user.password);
      console.log(checkPass);
      if (!checkPass) {
        throw new Error("password salah");
      }
      const token = generateToken({ id: user.id });

      delete user.dataValues.password;
      delete user.dataValues.createdAt;
      delete user.dataValues.updatedAt;

      console.log(user);

      res.status(200).json({
        message: "login succeed",
        result: { user, token },
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({
        message: err.toString(),
      });
    }
  },
  register: async (req, res) => {
    try {
      const { username, password, full_name, email, bio } = req.body;

      const findUser = await User.findOne({
        where: {
          [Op.or]: [{ username }, { email }],
        },
      });

      // if (findUser) {
      //   throw Error("username/email has been taken");
      // }

      console.log(findUser);

      const hashedPassword = bcrypt.hashSync(password, 5);

      const user = await User.create({
        username,
        password: hashedPassword,
        full_name,
        email,
        bio,
      });

      const token = await generateToken({
        id: user.id,
        isEmailVerification: true,
      });

      console.log(user.id + email + username);

      const verToken = await SendVerification(user.id, email, username);

      return res.status(200).json({
        message: "new user has been created",
        result: { user, token, verToken },
      });
    } catch (err) {
      console.log("error");
      return res.status(500).json({
        message: err.toString(),
      });
    }
  },
  keepLogin: async (req, res) => {
    // Terima token
    // Check kalau token valid
    // Renew token
    // Kirim token + user data
    try {
      const { token } = req;

      const renewedToken = generateToken({
        id: token.id,
        password: token.password,
      });

      const findUser = await User.findByPk(token.id);

      delete findUser.dataValues.password;

      return res.status(200).json({
        message: "Renewed user token",
        result: {
          user: findUser,
          token: renewedToken,
        },
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "Server error",
      });
    }
  },
  editProfile: async (req, res) => {
    try {
      const { username, full_name, user_id, bio } = req.body;
      let url = null;
      if (req.file) {
        let pic = await sharp(req.file.buffer).png().toBuffer();
        const checkAvatar = await Avatar.findOne({
          user_id,
        });

        if (!checkAvatar) {
          let newAva = new Avatar();
          newAva.image = pic;
          newAva.user_id = user_id;
          await newAva.save();
        } else {
          checkAvatar.image = pic;
          await checkAvatar.save();
        }
        url = `http://${process.env.UPLOAD_FILE_DOMAIN}/${process.env.USER_AVATAR}/${user_id}`;
      }

      await User.update(
        {
          avatar_url: url ? url : avatar_url,
          full_name,
          username,
          bio,
        },
        {
          where: {
            id: user_id,
          },
        }
      );

      const user = await User.findByPk(user_id);
      console.log(user);

      return res.status(200).json({
        message: "photo added",
        result: user,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Error",
      });
    }
  },
  renderAvatar: async (req, res) => {
    try {
      // Get user
      const { user_id } = req.params;

      const user = await Avatar.findOne({ user_id });

      if (!user) {
        throw new Error("No Avatar Found");
      }

      // Config untuk mengirim image
      res.set("Content-type", "image/png");

      // Kirim image
      res.send(user.image);
    } catch (err) {
      res.send(err);
    }
  },
  verifyUser: async (req, res) => {
    try {
      const { vertoken } = req.params;

      const isTokenVerified = verifyToken(vertoken, process.env.JWT_SECRET_KEY);

      if (!isTokenVerified || !isTokenVerified.isEmailVerification) {
        throw new Error("token is invalid");
      }

      await User.update(
        { is_verified: true },
        {
          where: {
            id: isTokenVerified.id,
          },
        }
      );

      return res.status(200).json({
        message: "User is Verified",
        success: true,
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({
        message: err.toString(),
        success: false,
      });
    }
  },

  verifyUserV2: async (req, res) => {
    try {
      const { vertoken } = req.params;

      const ver = await VerificationToken.findOne({
        where: {
          token: vertoken,
          is_valid: true,
          valid_until: {
            [Op.gt]: moment().utc(),
          },
        },
      });

      if (!ver) {
        return res.status(400).json({
          message: "token invalid",
          success: false,
        });
      }

      await User.update(
        { is_verified: true },
        {
          where: {
            id: ver.user_id,
          },
        }
      );

      await VerificationToken.update(
        { is_valid: false },
        {
          where: {
            token: vertoken,
          },
        }
      );

      return res.status(200).json({
        message: "User is Verified",
        success: true,
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({
        message: err.toString(),
        success: false,
      });
    }
  },

  registerUserV2: async (req, res) => {
    try {
      const { username, password, full_name, email, bio } = req.body;

      const findUser = await User.findOne({
        where: {
          [Op.or]: [{ username }, { email }],
        },
      });
      console.log(findUser);

      const hashedPassword = bcrypt.hashSync(password, 5);

      const user = await User.create({
        username,
        password: hashedPassword,
        full_name,
        email,
      });
      // Verification email
      const verificationToken = nanoid(40);

      await VerificationToken.create({
        token: verificationToken,
        user_id: user.id,
        valid_until: moment().add(1, "hour"),
        is_valid: true,
      });

      const verificationLink = `http://localhost:2020/auth/v2/verify/${verificationToken}`;

      const template = fs
        .readFileSync(__dirname + "/../templates/verify.html")
        .toString();

      const renderedTemplate = mustache.render(template, {
        username,
        verify_url: verificationLink,
        full_name,
      });

      await mailer({
        to: email,
        subject: "Verify your account!",
        html: renderedTemplate,
      });

      return res.status(201).json({
        message: "Registered user",
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "Server error",
      });
    }
  },
  loginV2: async (req, res) => {
    try {
      const { email, password, username } = req.body;

      const user = await User.findOne({
        where: {
          [Op.or]: [{ username }, { email }],
        },
      });

      if (!user) {
        throw new Error("username/email/password not found");
      }

      const checkPass = await bcrypt.compareSync(password, user.password);
      console.log(checkPass);
      if (!checkPass) {
        throw new Error("password salah");
      }
      const token = nanoid(64);

      // Create new session for logged in user
      await Session.create({
        user_id: user.id,
        is_valid: true,
        token: token,
        valid_until: moment().add(1, "day"),
      });

      delete user.dataValues.password;
      delete user.dataValues.createdAt;
      delete user.dataValues.updatedAt;

      console.log(user);

      res.status(200).json({
        message: "login succeed",
        result: { user, token },
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({
        message: err.toString(),
      });
    }
  },

  editUser: async (req, res) => {
    try {
      const { id } = req.params;

      await User.update(
        {
          ...req.body,
        },
        {
          where: {
            id,
          },
        }
      );

      return res.status(200).json({
        message: "User Profile Edited",
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: err.toString(),
      });
    }
  },

  // -------------------- Upload Profile Picture Controller
  uploadPic: async (req, res) => {
    try {
      const { id } = req.params;
      const uploadFileDomain = process.env.UPLOAD_FILE_DOMAIN;
      const filePath = "profile_pict";
      const { filename } = req.file;

      await User.update(
        {
          image_url: `${uploadFileDomain}/${filePath}/${filename}`,
        },
        {
          where: {
            id,
          },
        }
      );
      return res.status(200).json({
        message: "Success change profile picture",
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: err.toString(),
      });
    }
  },

  editAvatar: async (req, res) => {
    try {
      const { user_id } = req.params;
      console.log(user_id);
      console.log(req.body);
      let cek = "";
      console.log(req.file);
      const { username, full_name, bio } = req.body;
      if (req.file) {
        cek = await User.update(
          {
            avatar_url: `http://${process.env.UPLOAD_FILE_DOMAIN}/${process.env.USER_AVATAR}/${req.file.filename}`,
            bio,
            username,
            full_name,
          },
          {
            where: { id: user_id },
          }
        );
      } else {
        cek = await User.update(
          {
            bio,
            username,
            full_name,
          },
          {
            where: { id: user_id },
          }
        );
      }

      console.log(` ${bio} ${username} ${full_name} ${user_id}`);

      const user = await User.findByPk(user_id);
      return res.status(200).json({
        message: "Avatar Updated",
        user: user,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "Error Update Avatar",
      });
    }
  },

  renderAvatar: async (req, res) => {
    try {
      const { user_id } = req.params;

      const user = await User.findOne({ user_id });

      if (!User) {
        throw new Error("No Avatar Found");
      }
      res.set("ContentCard", "image/png");

      res.send(user.image);
    } catch (err) {
      res.send(err);
    }
  },
};

module.exports = userController;

// register => create 2 token
// token = login (id). by default exp = 2d
// token2 = verify(id , isEmailVerification = true) exp = 30m

// => login
// => email => link => verification page

// token = route.params

// localhost:3000/users/verify

// cek verifyToken(token)

// object token
// token.id
// token.isEmailVerification

// IF( token.isEmailVerification )
// {

//   axios.post(/users/verify) =>
//   try
//   cek user.is_verified ? throw error
//   update user.is_verified = true
//   catch error
// }
// else
// {
//   invalid token
// }

// <Text> your acc has been verified </Text>
// <Text> invalid token </Text>
