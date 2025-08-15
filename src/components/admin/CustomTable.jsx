import CustomTypography from "./CustomTypography";




function CustomTable({ maxWidth = "100%", tableName, tableData = [], tableHeaders = [], handleRowClick, showPointer = true }) {



const styles = {
  container: {
    boxShadow: "none",
    maxHeight: 450,
    overflowY: "auto",
    overflowX: "auto",
    maxWidth: "100%",
    "&::-webkit-scrollbar": {
      width: "4px",
      height: "4px",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#EAB308",
      borderRadius: "10px",
    },
  },
  headCell: {
    textAlign: "left",
    verticalAlign: "middle",
    borderBottom: "1px solid #ccc",
    fontFamily: "Jost",
    fontWeight: 600,
    fontStyle: "normal",
    fontSize: {
      xs: "11px", // small screens
      sm: "13px", // tablets
      md: "15px", // desktops
    },
    color: "#515151",
    backgroundColor: "#fff",
  },
  row: {
     cursor: showPointer ? 'pointer' : 'default',
  },
  bodyCell: {
    textAlign: "left",
    fontFamily: "Jost",
    fontStyle: "normal",
    fontSize: {
      xs: "12px",
      sm: "13px",
      md: "14px",
    },
    color: "#515151",
    border: "none",
  },
};

  return (
    <Grid container>
    
      <TableContainer component={Paper} elevation={0} sx={{ ...styles.container, maxWidth }}>
        <CustomTypography text={tableName} fontSize={{ xs: "16px", sm: "18px", md: "20px" }} fontWeight={600} sx={{ml:2, mt:1}} />
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {tableHeaders.map((header, index) => (
                <TableCell key={index} sx={styles.headCell}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {tableData.map((data, index) => (
              <TableRow key={index} sx={styles.row}>
                <TableCell sx={styles.bodyCell}>{index + 1}</TableCell>

                {(data.row || []).map((item, i) => (
                  <TableCell key={i} sx={styles.bodyCell}>
                    {item}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  );
}

export default CustomTable;
