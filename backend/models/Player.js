import mongoose from "mongoose"

const PlayerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
    trim: true,
  },
  role: {
    type: String,
    required: [true, "Please add a role"],
    enum: ["Batsman", "Bowler", "All-Rounder", "Wicket-Keeper"],
  },
  imageUrl: {
    type: String,
    default: "",
  },
  jerseyNumber: {
    type: Number,
    required: [true, "Please add a jersey number"],
    unique: true,
  },
  age: {
    type: Number,
    required: [true, "Please add age"],
  },
  experience: {
    type: Number,
    required: [true, "Please add years of experience"],
  },
  bio: {
    type: String,
    default: "",
  },
  stats: {
    matches: {
      type: Number,
      default: 0,
    },
    runs: {
      type: Number,
      default: 0,
    },
    wickets: {
      type: Number,
      default: 0,
    },
    average: {
      type: Number,
      default: 0,
    },
    economy: {
      type: Number,
      default: 0,
    },
    strikeRate: {
      type: Number,
      default: 0,
    },
    highestScore: {
      type: String,
      default: "0",
    },
    bestFigures: {
      type: String,
      default: "0/0",
    },
    fifties: {
      type: Number,
      default: 0,
    },
    hundreds: {
      type: Number,
      default: 0,
    },
    fiveWickets: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },
  },
  highlights: [String],
  recentPerformance: [
    {
      match: String,
      opponent: String,
      date: Date,
      runs: Number,
      wickets: Number,
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.model("Player", PlayerSchema)
