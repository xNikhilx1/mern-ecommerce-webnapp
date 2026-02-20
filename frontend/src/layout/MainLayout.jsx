import Header from "./Header";
import BottomNav from "./BottomNav";
import SideCategory from "./SideCategory";
import Footer from "./Footer";
import { useState } from "react";
import { Outlet } from "react-router-dom";

function MainLayout() {
  const [showCategory, setShowCategory] = useState(false);

  return (
    <div style={styles.wrapper}>
      <Header openCategory={() => setShowCategory(true)} />

      <SideCategory
        visible={showCategory}
        close={() => setShowCategory(false)}
      />

      <main style={styles.main}>
        <Outlet />
      </main>

      <Footer />

      <BottomNav />
    </div>
  );
}

const styles = {
  wrapper: {
    background: "#0f0f0f",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  main: {
    flex: 1,
  },
};

export default MainLayout;
