 const styles = {
    card: {
      borderRadius: 4,
      p: { md: 6, xs: 1 },
      backgroundColor: "#fff",
    },
    profileImageContainer: {
      justifyContent: { xs: "center", md: "left" },
      display: "flex",
      gap: 3,
    },
    profileImageBox: {
      width: 80,
      height: 80,
      border: "1px solid #ccc",
      borderRadius: 20,
      backgroundColor: "#F5F5F5",
      cursor: "pointer",
      overflow: "hidden",
      position: "relative",
      // display: "flex",
      justifyContent: "center",
      alignItems: "center",
      mb:1
    },
     labelBox: {
    width: 80,
    height: 80,
    border: "1px solid #ccc",
    borderRadius: 40,
    backgroundColor: "#F5F5F5",
    cursor: "pointer",
    overflow: "hidden",
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8, // Equivalent to MUI `mb: 1`
  },
    profileImageLabel: {
      width: "100%",
      height: "100%",
      cursor: "pointer",
    },
    profileImage: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      borderRadius: "8px",
    },
    dobTextField: {
      "& .MuiOutlinedInput-root": {
        height: "45px",
        borderRadius: "10px",
      },
    },
    buttonsContainer: {
      display: "flex",
      justifyContent: "flex-end",
      gap: 2,
    },
    cancelButton: {
      backgroundColor: "#fff",
      borderRadius: "10px",
      px: 4,
      width: { xs: "auto", sm: "auto" },
      color: "black",
      fontFamily: "Jost",
      fontWeight: 300,
      fontSize: "16px",
      textTransform: "none",
      "&:hover": { backgroundColor: "#fff" },
    },
    saveButton: {
      px: 4,
      width: { xs: "auto", sm: "auto" },
      fontFamily: "Jost",
      fontWeight: 300,
      fontSize: "16px",
    },
  };

  export default styles;
