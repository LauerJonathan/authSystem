// Configuration des dépendances
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

// Configuration d'Express
const app = express();
app.use(express.json());

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Modèle utilisateur
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);

// Middleware d'authentification
const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded._id });

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Veuillez vous authentifier." });
  }
};

// Routes d'authentification
// Inscription
app.post("/api/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérification si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Cet email est déjà utilisé" });
    }

    // Hashage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);

    // Création de l'utilisateur
    const user = new User({
      email,
      password: hashedPassword,
    });

    await user.save();

    // Génération du token JWT
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.status(201).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'inscription" });
  }
});

// Connexion
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Recherche de l'utilisateur
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Email ou mot de passe incorrect" });
    }

    // Vérification du mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Email ou mot de passe incorrect" });
    }

    // Génération du token JWT
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la connexion" });
  }
});

// Route protégée exemple
app.get("/api/profile", auth, async (req, res) => {
  res.json(req.user);
});

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
