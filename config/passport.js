const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User')
const jwt = require('jsonwebtoken')

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL
        },
        async (accessToken, refreshToken, profile,done) => {
            try {
                let user = await User.findOne({googleId:profile.id})
                if(!user){
                    user = new User({
                        name:profile.displayName,
                        email:profile.emails[0].value,
                        googleId:profile.id,
                        isVerified:true,

                    })
                    await user.save();
                }
                done(null,user);
            } catch (error) {
                done(error,false)
            }
        }
    )
)