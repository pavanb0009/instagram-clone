import { create } from "zustand";
import { persist } from "zustand/middleware"
import { userSlice } from "./userSlice";
import { notificationSlice } from "./notificationSlice";
import { messageSlice } from "./messageSlice";
import { mediaSlice } from "./mediaSlice";


const manageStore = create(
    persist((set, get) => ({
        ...userSlice(set, get),
        ...notificationSlice(set),
        ...messageSlice(set, get),
        ...mediaSlice(set, get),
    }),
        {
            name: "app-storage"
        }
    )
)

export default manageStore