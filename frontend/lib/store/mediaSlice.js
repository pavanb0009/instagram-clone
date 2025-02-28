import axios from "axios";

const handleError = (error, get) => {
    get().setErrorMessage(error.response ? error.response.data.message : error.message);
    get().setIsloading(false);
};

export const mediaSlice = (set, get) => ({
    
})