import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema({
    personal_info: {
        fullname: {
            type: String,
            required: true,
            minLength: [5, "Fullname must be at least 5 letters long"]
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            unique: true
        },
        password: {
            type: String,
        },
        username: {
            type: String,
            required: true,
            unique: true,
            minLength: [3, "Username must be at least 3 letters long"],
        },
        bio: {
            bioString: {
                type: String,
                maxLength: [200, "Bio should not be more than 200 characters"]
            },
            bioLink: {
                type: String,
                maxLength: [100, "Link should not be greater than 100 characters"]
            }
        },
        profile_img: {
            type: String,
            default: "https://scontent.fhyd11-3.fna.fbcdn.net/v/t1.30497-1/84628273_176159830277856_972693363922829312_n.jpg?stp=c379.0.1290.1290a_dst-jpg_s100x100&_nc_cat=1&ccb=1-7&_nc_sid=7565cd&_nc_ohc=Cce4d9FDjHIQ7kNvgH-O3Zd&_nc_ad=z-m&_nc_cid=2034&_nc_ht=scontent.fhyd11-3.fna&_nc_gid=AYpKzt3qrEKkZUHflzyR_dl&oh=00_AYCMmn3eeVBBdRIyuWoRAGDvdc3pnbi836QMZVjzzr2gqA&oe=6706BA99"
        }
    },
    account_info: {
        total_posts: {
            type: Number,
            default: 0
        }
    },
    google_auth: {
        type: Boolean,
        default: false
    },
    posts: [{
        type: Schema.Types.ObjectId,
        ref: "posts"
    }],
    reels: [{
        type: Schema.Types.ObjectId,
        ref: "reels"
    }],
    saved: [{
        item: {
            type: Schema.Types.ObjectId,
            required: true,
            refPath: 'saved.type'
        },
        type: {
            type: String,
            required: true,
            enum: ['posts', 'reels']
        }
    }],
    isVerified: {
        type: Boolean,
        default: false
    },
    otp: {
        code: {
            type: String
        },
        expiresAt: {
            type: Date
        }
    },
    deleteUser: {
        type: Date,
        default: null
    }
}, { timestamps: { createdAt: "joinedAt" } });

userSchema.pre("save", async function (next) {
    const user = this;

    if (user.isModified("personal_info.password") && user.personal_info.password) {
        const salt = await bcrypt.genSalt(10);
        user.personal_info.password = await bcrypt.hash(user.personal_info.password, salt);
    }

    if (user.isModified("otp.code") && user.otp.code) {
        const salt = await bcrypt.genSalt(10);
        user.otp.code = await bcrypt.hash(user.otp.code, salt);
    }

    if (this.isVerified || this.google_auth) {
        this.deleteUser = null;
    } else if (!this.deleteUser) {
        this.deleteUser = new Date(Date.now() + 10 * 60 * 1000); // Set expiration to 10 minutes from now
    }

    next();
});

const User = mongoose.model("User", userSchema);
export default User;