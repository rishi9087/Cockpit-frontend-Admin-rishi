import Navbar from "../../../components/admin/Navbar";
import CustomTypography from "../../../components/admin/CustomTypography";
import ArrowCircleLeftRoundedIcon from "@mui/icons-material/ArrowCircleLeftRounded";
import ReactSpeedometer from "react-d3-speedometer";

import { apiGet, apiPost } from "../../../api/axios";
import { max, min } from "date-fns";
import { LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { getAdminRoutePrefix } from "../../../utils/RoutePrefix";
import { snackbarEmitter } from "../../../components/admin/CustomSnackbar";

function StudentPerformance() {

  const routePrefix = getAdminRoutePrefix();
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState("Monthly");
  const [countResult, setCountResult] = useState();
  const [syllabus, setSyllabus] = useState([]);

  const [selectedSyllabus, setSelectedSyllabus] = useState(null);
  const [bookList, setBookList] = useState([]);
  const [selectedBook, setSelectedBook] = useState("");
  const [attempts, setAttempts] = useState("");
  const [selectedAttempt, setSelectedAttempt] = useState("");
  const [chartData, setChartData] = useState([]);

  const location = useLocation();
  const { student } = location.state || {};

  let data;

  useEffect(() => {
    const fetchFlightLogData = async () => {
      try {

        const days = selectedPeriod === "Monthly" ? 30 :  7;
        const toDate = new Date();
        console.log("to date", toDate);
        
        const fromDate = new Date(toDate.getTime() - days * 24 * 60 * 60 * 1000);

        console.log("from date", fromDate);
        

        const requestBody = {
          studentId: student?._id,
          fromDate: fromDate.toISOString(), 
          toDate: toDate.toISOString(),
        }
        const response = await apiPost('/countTotalTest', requestBody);
        // Handle the response data as needed
        console.log(response.data, "fflightLogDetails");
        setCountResult(response?.data?.data)
        data = [
          {
            name: 'Score',
            value: 62, // percentage
            fill: '#F5B400',
          },
        ];
      } catch (error) {
        snackbarEmitter("Something went wrong", "error");
      }
    }

    fetchFlightLogData();

    const fetchSyllabus = async () => {
      try {
        const response = await apiGet("/getSyllabus");
        setSyllabus(response.data.data);
        // getStudentProgress();
      } catch (error) {
        console.error("Error fetching syllabus:", error);
      }
    };


    fetchSyllabus();

  }, [selectedPeriod]);

  const [testSyllabus, setTestSyllabus] = useState([]);

  const fetchTestSyllabus = async () => {
    try {
      // const resSyllabus = await apiGet("/getSyllabus");
      // const syllabi = resSyllabus?.data?.data || [];

      // const response = await apiGet("/getTestAll");
      // const testData = response?.data?.data || [];

      // const testSyllabusIds = testData.map(test => test.syllabusId);


      // Step 2: Filter syllabi based on matching _id
      // const filteredSyllabi = syllabi.filter(syllabus =>
      //   testSyllabusIds.includes(syllabus._id)
      // );
      //   setTestSyllabus(filteredSyllabi);

      //   if (filteredSyllabi.length > 0) {
      //     handleSyllabusClick(filteredSyllabi[0]);
      //   }

      const res = await apiPost("/testGetAllSyllabus", { studentId: student?._id });
      if (res.data.status == 200) {
        setTestSyllabus(res.data.data);
        handleSyllabusClick(res.data.data[0]);
      } else {
        snackbarEmitter(res.data.message, "error");
      }



    } catch (error) {
      console.error("Error fetching syllabus:", error);
    }
  };

  useEffect(() => {
    fetchTestSyllabus();
  }, []);


  const handleSyllabusClick = async (syllabus) => {
    setSelectedSyllabus(syllabus);
    setSelectedBook("");
    // setAttempts([]);
    setChartData([]);
    try {
      // const bookResponse = await apiGet(`/booksBySyllabusId/${syllabus._id}`);
      const bookResponse = await apiPost(`/testGetAllBooks`, { studentId: student?._id, syllabusId: syllabus._id });
      const fetchedBooks = bookResponse?.data?.data || [];
      console.log(fetchedBooks, "fetchedBooks");

      setBookList(fetchedBooks);
    } catch (err) {
      console.error("Error fetching books:", err);
    }
  };

  const handleBookSelect = async (bookId) => {
    setSelectedBook(bookId);
    setSelectedAttempt("");
    try {
      const response = await apiPost(`/countTestAttemptsByBook`, { bookId: bookId, studentId: student?._id });
      console.log(response.data.data.testAttempts, "responseattempts");

      const Attempts = response?.data?.data?.testAttempts;
      console.log(Attempts, "attempts");

      setAttempts(Attempts);
      const chartData = await apiPost(`/testChartData`, { bookId: bookId, studentId: student?._id });
      console.log(chartData, "chartData");



      const rawChartData = chartData?.data?.data || [];
      console.log(rawChartData, "rawChartData");

      const processedData = rawChartData.map((item) => {
        const score =
          item.total > 0 ? Math.round((item.correct / item.total) * 100) : 0;

        return {
          ...item,
          score,
          label: item.month,
        };
      });

      setChartData(processedData);
    } catch (err) {
      console.error("Error fetching chart/attempts data:", err);
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      const { score, total, correct, incorrect } = payload[0].payload;
      return (
        <div style={{ background: "#fff", padding: "10px", border: "1px solid #ccc", borderRadius: "8px" }}>
          <p><strong>{label}</strong></p>
          <p>Score: {score}</p>
          <p>Total: {total}</p>
          <p>Correct: {correct}</p>
          <p>Incorrect: {incorrect}</p>
        </div>
      );
    }
    return null;
  };

  const handleNav = (syllabus) => {
    navigate(`${routePrefix}/studentChapter`, {
      state: {
        syllabusTitle: syllabus.title,
        syllabusId: syllabus._id,
        studentId: student?._id
      }
    })
  }


  // const grade = useMemo(() => {
  //   const raw = countResult?.grade ?? 0;
  //   return raw > 0 && raw < 1 ? 1 : Number(raw.toFixed(2));
  // }, [countResult]);


  return (
    <Navbar title="Student Profile">
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 5 }}>
        <ArrowCircleLeftRoundedIcon sx={{ color: "#EAB308", fontSize: "28px", cursor: "pointer" }} onClick={() => window.history.back()} />
        <CustomTypography
          text={"Performance"}
          mb={0}
          fontWeight={500}
          fontSize={{ xs: "14px", sm: "16px", md: "16px" }}
        />
      </Box>

      <Grid container sx={{ display: "flex", gap: { xs: 4, md: 8, sm: 4 }, mb: 4 }}>

        <Grid size={{ xs: 12, md: 5, sm: 5 }} >
          <Card sx={{ overflowX: "auto", py: { xs: 2, md: 5, sm: 5.3 }, px: { xs: 2, md: 5, sm: 5.3 }, borderRadius: 3, border: " 1px solid #E5E7E9" }}>
            <CustomTypography
              text={"About"}
              sx={{ fontWeight: "bold", mb: 1 }}
            />

            <Box sx={{ display: "flex", gap: 2 }}>
              <Box sx={{ border: "1px solid #E5E7E9", borderRadius: "10px", padding: "20px" }} >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                  <Avatar sx={{ width: { xs: 25, md: 35, sm: 35 }, height: { xs: 25, md: 35, sm: 35 }, }} ></Avatar>

                  <CustomTypography
                    text={`${student?.firstName} ${student?.lastName}`}
                    fontSize={{ xs: '11px', sm: '13px', md: '14px' }}
                    sx={{ fontWeight: "bold", mb: 0 }} />
                </Box>
                <CustomTypography text={"Info"} sx={{ fontWeight: "bold", mb: 1 }} />

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <CalendarTodayIcon sx={{ color: "#EAB308", fontSize: { xs: "18px", md: "20px", sm: "22px" } }} />

                  <Box >
                    <CustomTypography
                      text={new Date(student.createdAt).toLocaleDateString()}
                      sx={{ fontWeight: "bold", mb: 0 }} fontSize={{ xs: "10px", md: "12px", sm: "12px" }} />

                    <CustomTypography
                      text={"Joined date"}
                      fontSize={{ xs: "10px", md: "12px", sm: "12px" }}
                      sx={{ color: '#9E9E9E', mb: 0 }} />

                  </Box>

                </Box>
              </Box>

              <Box >
                <CustomTypography text={"Contact"} sx={{ fontWeight: "bold", mb: 1 }} />
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                  <EmailOutlinedIcon sx={{ color: "#EAB308" }} />

                  <Box >
                    <CustomTypography
                      text={'Email'}
                      sx={{ mb: 0, color: '#9E9E9E' }} />

                    <CustomTypography
                      text={student.email}
                      // fontSize={{xs: "10px", md: "12px", sm: "12px"}}
                      sx={{ mb: 0 }} />

                  </Box>

                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <SmartphoneIcon sx={{ color: "#EAB308" }} />

                  <Box >
                    <CustomTypography
                      text={'Phone'}
                      sx={{ mb: 0, color: '#9E9E9E' }} />

                    <CustomTypography
                      text={student.phone}
                      // fontSize={{xs: "10px", md: "12px", sm: "12px"}}
                      sx={{ mb: 0 }} />

                  </Box>

                </Box>
              </Box>
            </Box>
          </Card>
        </Grid>

        <Grid item size={{ xs: 12, md: 4, sm: 5 }} >
          <Card sx={{ p: { xs: 1, sm: 1 }, borderRadius: 3, border: " 1px solid #E5E7E9", justifyContent: "center", textAlign: "center" }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <CustomTypography text={"Test Performance"} sx={{ fontWeight: "bold", mb: 0 }} />
                <Select
                  size="small"
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  sx={{ fontSize: 14 }}
                >
                  <MenuItem value="Weekly">Weekly</MenuItem>
                  <MenuItem value="Monthly">Monthly</MenuItem>
                </Select>

              </Box>
            </CardContent>
            {countResult && (
              <ReactSpeedometer
                value={countResult?.grade}
                minValue={0}
                maxValue={100}
                segments={100}
                segmentColors={["#EAB308", "#F8EFE2"]}
                startColor="#EAB308"
                endColor="#F8EFE2"
                needleColor="#EAB308"
                needleTransition="easeElastic"
                needleHeightRatio={0.5}
                ringWidth={15}
                textColor="#000"
                customSegmentStops={[0, countResult?.grade, 100]}
                currentValueText={` Grade: ${countResult?.grade ? countResult?.grade?.toFixed(2) : "0"}%`}
                height={180}
                width={270}
              />
            )}
            {/* <Typography variant="caption" color="text.secondary" mt={1}>
                {`Your grade is ${countResult?.grade.toFixed(2)}%`}
              </Typography> */}
          </Card>
        </Grid>
      </Grid>

      <CustomTypography
        text={"Training"}
        sx={{ fontWeight: "bold", mb: 2 }}
        fontSize={{ xs: "14px", md: "16px", sm: "16px" }}
      />



      <Box sx={{ maxWidth: '100%', overflowX: 'auto' }} mb={8}>
        <Box sx={{ display: 'flex', gap: '15px', padding: '10px', width: 'max-content' }}>
          {
            syllabus?.map((item, index) => (
              <Box key={index} onClick={() => handleNav(item)} sx={{ cursor: 'pointer', border: '1px solid transparent', '&:hover': { borderColor: '#EAB308' }, display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'space-between', boxShadow: 3, borderRadius: '10px', px: 2, py: 1, minWidth: { xs: '45px', md: '120px', sm: '60px' } }}>
                <img src="/images/btn.svg" alt="" />
                <CustomTypography
                  text={item.title}
                  fontWeight={500}
                  fontSize={{ xs: "14px", sm: "16px", md: "16px" }}
                />

              </Box>


            ))
          }
        </Box>
      </Box>


      <CustomTypography
        text={"Test Analysis"}
        sx={{ fontWeight: "bold", mb: 2 }}
        fontSize={{ xs: "14px", md: "16px", sm: "16px" }}
      />

      <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', py: 2 }}>
        {testSyllabus.map((item, index) => (
          <Card
            key={index}
            onClick={() => handleSyllabusClick(item)}
            sx={{
              cursor: "pointer",
              minWidth: 220, // ensures horizontal scroll
              borderRadius: 3,
              boxShadow: 3,
              display: "flex",
              flexDirection: "column",
              flexShrink: 0, // important for horizontal scroll
              border: selectedSyllabus?._id === item._id ? "2px solid #EAB308" : "none",
            }}
          >
            <CardMedia
              component="img"
              height="160"
              image={item.imageUrl}
              alt={item.title}
            />
            <CardContent
              sx={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <CustomTypography
                  text={item.title}
                  fontWeight={500}
                  fontSize={{ xs: "14px", sm: "16px", md: "16px" }}
                />
                <CustomTypography
                  text={item.category}
                  fontWeight={500}
                  color="#EAB308"
                  fontSize={{ xs: "10px", sm: "11px", md: "12px" }}
                />
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Typography fontWeight={600} fontSize={22} mb={2}>
        Please select a book to continue
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth>
            <InputLabel>Book</InputLabel>
            <Select
              value={selectedBook}
              label="Book"
              onChange={(e) => handleBookSelect(e.target.value)}
            >
              {bookList.map((book, index) => (
                <MenuItem key={index} value={book._id}>
                  {book.bookTitle}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          {console.log(attempts, "attempts")}
          <FormControl fullWidth>
            <TextField
              fullWidth
              label="Number of Attempts"
              placeholder="Number of Attempts"
              value={attempts?.toString() || "0"}
              InputProps={{ readOnly: true }}
              disabled
            />
          </FormControl>
        </Grid>
      </Grid>

      {/* Chart Section */}
      <Box
        sx={{
          background: "#fff",
          borderRadius: 2,
          p: 3,
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        }}
      >
        <Typography variant="h6" fontWeight={600} mb={1}>
          Test Score Progress
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Track how your test progress compares over time.
        </Typography>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis
              label={{ value: "Score", angle: -90, position: "insideLeft" }}
              domain={[0, 100]} // <- This keeps it fixed from 0 to 100
            />
            <RechartsTooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#F5B400"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>

    </Navbar>
  );
}
export default StudentPerformance;
