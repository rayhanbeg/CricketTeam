import mongoose from "mongoose"

const MatchSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: [true, "Please add a date"],
  },
  opponent: {
    type: String,
    required: [true, "Please add an opponent team name"],
    trim: true,
  },
  format: {
    type: String,
    required: [true, "Please add a match format"],
    enum: ["T20", "One Day", "Test", "Friendly"],
  },
  result: {
    type: String,
    required: [true, "Please add a result"],
    enum: ["Won", "Lost", "Draw"],
  },
  score: {
    type: String,
    required: [true, "Please add a score"],
  },
  venue: {
    type: String,
    required: [true, "Please add a venue"],
  },
  playerPerformances: [
    {
      player: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Player",
      },
      runs: Number,
      wickets: Number,
      catches: Number,
      runouts: Number,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.model("Match", MatchSchema)
