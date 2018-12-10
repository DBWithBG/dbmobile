import axios from "axios";

const BASE_URL = "https://dev-deliverbag.supconception.fr"

class Api {

    constructor() {
        this.jwt = window.localStorage.getItem("jwt");
        this.header = {
            headers: {
                Authorization: 'Bearer ' + this.jwt
            }
        };
    }

    /****************************** PROFIL CUSTOMER ET DRIVER ******************************/

    /**
     * Fetch current driver informations
     */
    readDriver() {
        return axios.get(BASE_URL + "/mobile/driver", this.header);
    }

    /**
     * Fetch current customer informations
     */
    readCustomer() {
        return axios.get(BASE_URL + "/mobile/customer", this.header);
    }

    /**
     * Update customer informations
     */
    updateCustomerInfos(first_name, last_name, phone) {
        return axios.put(BASE_URL + "/mobile/customer", {
            surname: first_name,
            name: last_name,
            phone: phone
        }, this.header);
    }

    /**
     * Update driver informations
     */
    updateDriverInfos(first_name, last_name, phone, max_bags) {
        return axios.put(BASE_URL + "/mobile/driver", {
            surname: first_name,
            name: last_name,
            phone: phone,
            max_bags
        }, this.header);
    }

    /**
     * Update email address for customer and driver
     */
    updateEmail(email) {
        return axios.put(BASE_URL + "/mobile/email", {
            email
        }, this.header);
    }

    /**
     * Update password for customer and driver
     */
    updatePassword(current_password, new_password) {
        return axios.put(BASE_URL + "/mobile/password", {
            current_password,
            new_password,
            new_password_again: new_password
        }, this.header);
    }

    refreshNotifyToken(token) {
        return axios.put(BASE_URL + "/mobile/users/refreshNotifyToken",
                { notify_token: token }, this.header);
    }

    static login(email, password) {
        return axios.post(BASE_URL + "/mobile/login", {
          email,
          password
        })
    }
}

export default Api;