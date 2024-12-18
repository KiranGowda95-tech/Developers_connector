const express = require("express");
const request=require('request')
const config=require('config')
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const Profile = require("../../models/Profile");
const User = require("../../models/Users");

//@route GET api/profile/me
//@desc Get current users profile
//@access Private

router.get("/me", auth, async (req, res) => {
  try {
    console.log("entering before profile");
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "avatar"]
    );
    console.log("entering after profile");

    if (!profile) {
      return res
        .status(400)
        .json({ msg: "There is no profile for this user " });
    }
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

//@route POST api/profile
//@desc create or update user profile
//@access Private

router.post(
  "/",
  [
    auth,
    [
      check("status", "Status is required").not().isEmpty(),
      check("skills", "Skills is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    //Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(",").map((skill) => skill.trim());
      console.log(profileFields.skills);
    }
    console.log(profileFields.skills);

    //Build social object
    profileFields.social = {};
    if (twitter) profileFields.social.twitter = twitter;
    if (youtube) profileFields.social.youtube = youtube;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    console.log("twitter", profileFields.social.twitter);

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        //Update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        console.log("form route profile file", profile);
        return res.json(profile);
      }
      //Create
      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);

//@route GET api/profile
//@desc Get all profiles
//@access public

router.get("/", async (req, res) => {
  console.log("entering into get profiles");
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    console.log(profiles);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route GET api/profile/user/user_id
//@desc Get profile by user ID
//@access public

router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["name", "avatar"]);
    console.log("from profile get end point", profile);
    if (!profile) return res.status(400).send({ msge: "Profile not found" });

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind == "ObjectId") {
      return res.status(400).send("Profile not found");
    }
    res.status(500).send("Server Error");
  }
});

//@route DELETE api/profile
//@desc delete profile,user & posts
//@access private

router.delete("/", auth, async (req, res) => {
  try {
    //Remove profile
    await Profile.findOneAndDelete({ user: req.user.id });

    //Remove user
    await User.findOneAndDelete({ _id: req.user.id });

    res.json({ msg: "User deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route PUT api/profile/experiance
//@desc Add profile experiance
//@access private

router.put(
  "/experience",
  [
    auth,
    [
      check("title", "Title is required").not().isEmpty(),
      check("company", "Company is required").not().isEmpty(),
      check("from", "From data is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, company, location, from, to, current, description } =
      req.body;

    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.experience.unshift(newExp);
      await profile.save()
      res.json(profile);
    } catch (err) {
      console.error(err.message)
    }
    console.log("entering out of put request");
  }
);

//@route delete api/profile/:exp_id
//@desc delete  experiance from profile
//@access private
router.delete('/experience/:exp_id',auth,async(req,res)=>{
  try {
    const profile=await Profile.findOne({user:req.user.id})
    //Get remove index
    const removeIndex=profile.experience.map(item=>item.id).indexOf(req.params.exp_id)

    profile.experience.splice(removeIndex,1)

    await profile.save()

      res.json(profile)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

//@route PUT api/profile/education
//@desc Add profile education
//@access private

router.put(
  "/education",
  [
    auth,
    [
      check("school", "Title is required").not().isEmpty(),
      check("degree", "Degree is required").not().isEmpty(),
      check("fieldofstudy", "Field of Study data is required").not().isEmpty(),
      check("from", "From data is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { school, degree, fieldofstudy, from, to, current, description } =
      req.body;

    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.education.unshift(newEdu);
      await profile.save()
      res.json(profile);
    } catch (err) {
      console.error(err.message)
    }
    console.log("entering out of put request");
  }
);

//@route delete api/profile/:exp_id
//@desc delete  education from profile
//@access private
router.delete('/education/:edu_id',auth,async(req,res)=>{
  try {
    const profile=await Profile.findOne({user:req.user.id})
    //Get remove index
    const removeIndex=profile.education.map(item=>item.id).indexOf(req.params.edu_id)

    profile.education.splice(removeIndex,1)

    await profile.save()

      res.json(profile)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

// @route GET api/profile/github/:username
// @desc Get user repos from Github
// @access Public

router.get('/github/:username',(req,res)=>{
  try {
    const options={
      uri:`https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get('githubClientId')}&client_secret=${config.get('githubSecret')}`,
      method:'GET',
      header:{'user-agent':'node.js'}
    }
    request(options,(error,response,body)=>{
      if(error)console.error(error)
      if(response.statusCode !==200){
       return res.status(404).json({msg:'No github profile found'})
      }
      res.json(JSON.parse(body))
    })

  } catch (error) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})



module.exports = router;
