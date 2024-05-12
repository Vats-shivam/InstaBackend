import mongoose from 'mongoose';

const IgDataSchema = new mongoose.Schema({
    followersCount: String,
    followingsCount: String,
    postsCount: String,
    followersGrowth: String,
    weeklyFollowers: String,
    engagementRate: String,
    avgLikes: String,
    avgComments: String,
    followersRatio: String,
    commentRatio: String,
    username: String,
    instaStats: [
        {
            date: String,
            followers: String,
            following: String,
            media: String,
            engagementRatio: String,
        }
    ],
});

const IgData = mongoose.model('IgData', IgDataSchema);

export default IgData;