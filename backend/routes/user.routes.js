import { updateProfile } from "../Controllers/user.controller";
import isAuthenticated from "../middlewares/isAuthenticated";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/profile/update").post(isAuthenticated,updateProfile);

export default router;

