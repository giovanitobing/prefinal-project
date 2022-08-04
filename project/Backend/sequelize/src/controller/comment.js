const { Comment, User } = require("../lib/sequelize");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const { generateToken } = require("../lib/jwt");
const DEFAULT_LIMIT_COMMENT = 3;
const commentController = {
  fetchComment: async (req, res) => {
    try {
      const { PostId, limit } = req.query;

      console.log(PostId);
      const comments = await Comment.findAll({
        include: User,
        where: {
          PostId,
        },
        limit: limit != undefined ? parseInt(limit) : DEFAULT_LIMIT_COMMENT,
      });
      console.log(comments);

      res.status(200).json({
        message: "fetching comments",
        result: comments,
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({
        message: err.toString(),
      });
    }
  },
  postComment: async (req, res) => {
    try {
      const { UserId, content, PostId } = req.body;

      console.log(req.body);

      await Comment.create({
        UserId,
        content,
        PostId,
      });

      return res.status(200).json({
        message: "new comment added",
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: err.toString(),
      });
    }
  },
};

module.exports = commentController;
