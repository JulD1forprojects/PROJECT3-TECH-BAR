/*const User = require('../models/userModel');
const userSeed = require('../seedData/userSeed');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const seedUser = async (req, res) => {
    
    await User.deleteMany({});

    const hashedUserSeed = userSeed.map(user => {

        const hashedPassword = bcrypt.hashSync(user.password, saltRounds);

        return {
            name: user.name,
            email: user.email,
            password: hashedPassword
        }
    })

    // console.log(hashedUserSeed);

    const result = await User.insertMany(hashedUserSeed);
    
    try {
        if (result) return res.status(201).json(result)
        else return res.status(400).json({ message: "Seed user error"})
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
}

const handleSignup = async (req, res) => {

    const { name, email, password } = req.body;

    const foundUser = await User.findOne({email: email});

    if ( !name || !email || !password ) 
        return res.status(400).json({ message: "Error: Please fill up all fields"});

    if (name.length < 4) return res.status(400).json({ message: "Error: Name should have more than 4 characters"});

    if (name.length > 30) return res.status(400).json({ message: "Error: Name Cannot Exceed 30 Characters"});

    if (password.length < 6) return res.status(400).json({ message: "Error: Password should have more then 6 characters"});

    if (foundUser) return res.status(401).json({ message: "This email has been taken"})

    try {
        if (!foundUser) {
            bcrypt.hash(password, saltRounds, async(err, hash) => {
                const newUser = {
                    name: name,
                    email: email,
                    password: hash
                }
    
            const result = await User.create(newUser);
            console.log(result)
            if (result) return res.status(201).json({ 
                message: `New account ${email} created`,
                user: {
                    name: name,
                    email: email,
                    _id: result._id
                },
                success: true,
            })
            if (!result) return res.status(401).json({ message: "Error: account not created"})
            })
        } 
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" })
    }
    
}

const handleLogin = async (req, res) => {

    const { email, password } = req.body;
    // console.log(email, password)

    if ( !email || !password ) 
        return res.status(400).json({ message: "Error: Please fill up all fields"});

    if (password.length < 6) return res.status(400).json({ message: "Error: Password should have more then 6 characters"});

    const foundUser = await User.findOne({email: email});

    if (!foundUser) return res.status(401).json({ message: "Error: Account not found"})

    try {
        if (foundUser) {
            const result = await bcrypt.compareSync(password, foundUser.password); 
            req.session.name = foundUser.name;
            req.session.email = foundUser.email;
            req.session._id = foundUser._id;
            req.session.save();
            console.log(req.session)
            if (result) return res.status(200).json({ 
                message: `${foundUser.email} successfully logged in`,
                user: {
                    name: foundUser.name,
                    email: foundUser.email,
                    _id: foundUser._id
                },
                success: true
            })
            if (!result) return res.status(401).json({ message: "Error: cannot log in"})
            }
        }        
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" })
    }    
}

const handleLogout = async (req, res) => {
    const { email } = req.session;
    if (!email) return res.status(400).json({ message: "Cannot logout, user info not found" });

    const result = await User.findOne({email: email});
    
    try {
        if (result) {
            req.session.name = null;
            req.session.email = null;
            req.session._id = null;
            req.session.save();
            return res.status(200).json({ message: `account ${email} successfully logged out`})
        }
        if (!result) return res.status(401).json({ message: "Cannot logout, user info not found" });
    } catch (error) {
        return res.status(500).json({ message: "Cannot logout, server error" });
    }   
}

const handleRefresh = async (req, res) => {
    console.log(req.session);
    const { _id } = req.session;
    const foundUser = await User.findOne({_id: _id});
    
    try {
        if (foundUser) {
            const userInfo = {
                _id: _id,
                name: foundUser.name,
                email: foundUser.email
            }
            return res.status(200).json({user: userInfo})
        };
        if (!foundUser) return res.status(401).json({ 
            message: "User not previously logged in",
            refresh: false
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: `${error}` })
    }
}

const handleUpdateProfile = async (req, res) => {
    const { name, email, password, _id } = req.body;
    const foundUser = await User.findOne({_id: _id});
    console.log(foundUser);
    if (!foundUser) return res.status(401).json({ message: "Error, user is not logged in"});
    
    if (!name) return res.status(400).json({ message: "Error, user name not provided"});
    
    if (name.length < 4) return res.status(400).json({ message: "Error: Name should have more than 4 characters"});

    if (name.length > 30) return res.status(400).json({ message: "Error: Name Cannot Exceed 30 Characters"});

    // if (password.length < 6) return res.status(400).json({ message: "Error: Password should have more then 6 characters"});

    const checkDuplicateEmail = await User.findOne({email: email});

    // if email exists check if the id belongs to the same user
    // if email is new, skip to the try catch
    if (checkDuplicateEmail) {
        if (checkDuplicateEmail.name !== foundUser.name) 
            return res.status(401).json({ message: "This email has been taken"});
    }   
    
    
    try {
        if (foundUser) {
            const result = await bcrypt.compareSync(password, foundUser.password); 
            if (!result) return res.status(401).json({ message: "Error: Incorrect username or password"})
            const updateUser = await User.findOneAndUpdate({_id: _id}, { name: name, email: email })
            return res.status(200).json({
                message: `${updateUser.email} successfully updated profile`,
                user: {
                    name: name,
                    email: email,
                    _id: _id
                },
                success: true
            })
        };
        if (!foundUser) return res.status(401).json({ message: "User not previously logged in" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: `${error}` })
    }
}

module.exports = { seedUser, handleSignup, handleLogin, handleLogout, handleRefresh, handleUpdateProfile }
*/

const User = require("../models/userModel");
const userSeed = require("../seedData/userSeed");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const seedUser = async (req, res) => {
  await User.deleteMany({});

  const hashedUserSeed = userSeed.map((user) => {
    const hashedPassword = bcrypt.hashSync(user.password, saltRounds);

    return {
      name: user.name,
      email: user.email,
      password: hashedPassword,
    };
  });

  // console.log(hashedUserSeed);

  const result = await User.insertMany(hashedUserSeed);

  try {
    if (result) return res.status(201).json(result);
    else return res.status(400).json({ message: "Seed user error" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

const handleSignup = async (req, res) => {
  const { name, email, password } = req.body;

  const foundUser = await User.findOne({ email: email });

  if (!name || !email || !password)
    return res
      .status(400)
      .json({ message: "Error: Please fill up all fields" });

  if (name.length < 4)
    return res
      .status(400)
      .json({ message: "Error: Name should have more than 4 characters" });

  if (name.length > 30)
    return res
      .status(400)
      .json({ message: "Error: Name Cannot Exceed 30 Characters" });

  if (password.length < 6)
    return res
      .status(400)
      .json({ message: "Error: Password should have more then 6 characters" });

  if (foundUser)
    return res.status(401).json({ message: "This email has been taken" });

  try {
    if (!foundUser) {
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        const newUser = {
          name: name,
          email: email,
          password: hash,
        };

        const result = await User.create(newUser);
        console.log(result);
        if (result)
          return res.status(201).json({
            message: `New account ${email} created`,
            user: {
              name: name,
              email: email,
              _id: result._id,
            },
            success: true,
          });
        if (!result)
          return res
            .status(401)
            .json({ message: "Error: account not created" });
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

const handleLogin = async (req, res) => {
  const { email, password } = req.body;
  // console.log(email, password)

  // ! E-MAIL & PASSWORD VALIDATION
  if (!email || !password)
    return res
      .status(400)
      .json({ message: "Error: Please fill up all fields" });

  if (password.length < 6)
    return res
      .status(400)
      .json({ message: "Error: Password should have more then 6 characters" });

  const foundUser = await User.findOne({ email: email });

  if (!foundUser)
    return res.status(401).json({ message: "Error: Account not found" });

  // ! CHECK PASSWORD AND ADD TO SESSSION
  try {
    if (foundUser) {
      const result = await bcrypt.compareSync(password, foundUser.password);
      req.session.name = foundUser.name;
      req.session.email = foundUser.email;
      req.session._id = foundUser._id;
      req.session.save();
      console.log(req.session);
      if (result)
        return res.status(200).json({
          message: `${foundUser.email} successfully logged in`,
          user: {
            name: foundUser.name,
            email: foundUser.email,
            _id: foundUser._id,
          },
          success: true,
        });
      if (!result)
        return res.status(401).json({ message: "Error: cannot log in" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

const handleLogout = async (req, res) => {
  const { email } = req.session;
  if (!email)
    return res
      .status(400)
      .json({ message: "Cannot logout, user info not found" });

  const result = await User.findOne({ email: email });

  try {
    if (result) {
      req.session.name = null;
      req.session.email = null;
      req.session._id = null;
      req.session.save();
      return res
        .status(200)
        .json({ message: `account ${email} successfully logged out` });
    }
    if (!result)
      return res
        .status(401)
        .json({ message: "Cannot logout, user info not found" });
  } catch (error) {
    return res.status(500).json({ message: "Cannot logout, server error" });
  }
};

const handleRefresh = async (req, res) => {
  console.log(req.session);
  const { _id } = req.session;
  const foundUser = await User.findOne({ _id: _id });

  try {
    if (foundUser) {
      const userInfo = {
        _id: _id,
        name: foundUser.name,
        email: foundUser.email,
      };
      return res.status(200).json({ user: userInfo });
    }
    if (!foundUser)
      return res.status(401).json({
        message: "User not previously logged in",
        refresh: false,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `${error}` });
  }
};

const handleUpdateProfile = async (req, res) => {
  const { name, email, password, _id } = req.body;
  const foundUser = await User.findOne({ _id: _id });
  console.log(foundUser);
  if (!foundUser)
    return res.status(401).json({ message: "Error, user is not logged in" });

  if (!name)
    return res.status(400).json({ message: "Error, user name not provided" });

  if (name.length < 4)
    return res
      .status(400)
      .json({ message: "Error: Name should have more than 4 characters" });

  if (name.length > 30)
    return res
      .status(400)
      .json({ message: "Error: Name Cannot Exceed 30 Characters" });

  // if (password.length < 6) return res.status(400).json({ message: "Error: Password should have more then 6 characters"});

  const checkDuplicateEmail = await User.findOne({ email: email });

  // if email exists check if the id belongs to the same user
  // if email is new, skip to the try catch
  if (checkDuplicateEmail) {
    if (checkDuplicateEmail.name !== foundUser.name)
      return res.status(401).json({ message: "This email has been taken" });
  }

  try {
    if (foundUser) {
      const result = await bcrypt.compareSync(password, foundUser.password);
      if (!result)
        return res
          .status(401)
          .json({ message: "Error: Incorrect username or password" });
      const updateUser = await User.findOneAndUpdate(
        { _id: _id },
        { name: name, email: email }
      );
      req.session.name = name;
      req.session.email = email;
      req.session._id = _id;
      req.session.save();
      return res.status(200).json({
        message: `${updateUser.email} successfully updated profile`,
        user: {
          name: name,
          email: email,
          _id: _id,
        },
        success: true,
      });
    }
    if (!foundUser)
      return res.status(401).json({ message: "User not previously logged in" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `${error}` });
  }
};

module.exports = {
  seedUser,
  handleSignup,
  handleLogin,
  handleLogout,
  handleRefresh,
  handleUpdateProfile,
};
