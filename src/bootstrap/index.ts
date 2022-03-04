import axios from "axios";
import axiosRetry from "axios-retry";

export const bootstrap = () => {
	axios.defaults.timeout = 1000 * 60;

	axiosRetry(axios, {
		retries: 3,
		retryDelay: axiosRetry.exponentialDelay,
	});
}
