import { nanoid } from "nanoid"

export const generateUsername = async (User, name) => {
    let username = name.split(" ")[0]

    let userExists = await User.findOne({ "personal_info.username": username })

    userExists ? username + "_" + nanoid(5) : ""


    return username
}