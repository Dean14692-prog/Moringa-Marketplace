import "./App.css";
import Landingpage from "./pages/landingpage";
import SignupForm from "./pages/signup";
import LoginForm from "./pages/login";
import ProjectLayout from "./pages/projectlist";
import EcommerceLayout from "./pages/shoppingpage";
import Profile from "./pages/Profile"
import MyProjects from "./pages/MyProjects";
import UploadProject from "./pages/UploadProject";
import { StudentDashBoard } from "./pages/StudentDashBoard";

function App() {
  return (
    <>
      <div>
        <Landingpage />
        {/* <SignupForm /> */}
        {/* <LoginForm /> */}
        {/* <ProjectLayout /> */}
        {/* <EcommerceLayout /> */}
        {/* <Profile /> */}
        {/* <MyProjects /> */}
        {/* <UploadProject /> */}
        {/* <StudentDashBoard /> */}
      </div>
    </>
  );
}

export default App;
