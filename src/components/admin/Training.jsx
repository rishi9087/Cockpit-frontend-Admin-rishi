import CustomTypography from "./CustomTypography";
import CustomTextArea from "./CustomTextArea";
import { apiGet, apiPost, apiPostUpload } from "../../api/axios";
import CustomButton from "./CustomButton";
import { snackbarEmitter } from "./CustomSnackbar";
import CustomTextField from "./CustomTextField";

function Training({ syllabusNav = false, syllabusName, bookName, chapterName, question, syllabusId, chapterId, bookId, report = false, modalClose, bulkButton = false }) {

  // console.log("syllabusId", syllabusId);
  // console.log("bookId", bookId);
  // console.log("chapterId", chapterId);

  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([1, 2]);
  const [formData, setFormData] = useState({
    syllabus: syllabusNav ? syllabusName : "",
    book: syllabusNav ? bookName : "",
    chapter: syllabusNav ? chapterName : "",
    syllabusId: syllabusNav ? syllabusId : "",
    bookId: syllabusNav ? bookId : "",
    chapterId: syllabusNav ? chapterId : "",
    question: question?.question || "",
    options: question?.options || [
      { id: 1, text: "", isCorrect: false },
      { id: 2, text: "", isCorrect: false },
    ],
    explanation: question?.explanation || "",
  });

  // console.log("form data", formData);


  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.syllabus.trim()) newErrors.syllabus = "Syllabus is required.";
    if (!formData.book.trim()) newErrors.book = "Book is required.";
    if (!formData.chapter.trim()) newErrors.chapter = "Chapter is required.";
    if (!formData.question.trim()) newErrors.question = "Question is required.";
    // if (!formData.explanation.trim())
    //   newErrors.explanation = "Explanation is required.";
    formData.options.forEach((opt, i) => {
      if (!opt.text.trim())
        newErrors[`option_${i}`] = "Option text is required.";
    });
    if (!formData.options.some((opt) => opt.isCorrect)) {
      newErrors.correct = "Please select the correct answer.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // =================== Input Handlers ===================
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "syllabus") {
      const selected = syllabus.find((s) => s._id === value);
      setFormData((prev) => ({
        ...prev,
        syllabus: selected?.title,
        syllabusId: selected?._id || "",
        book: "",
        chapter: "",
        bookId: "",
        chapterId: ""
      }));
      setErrors((prev) => ({ ...prev, syllabus: undefined }));
      getBooks(value, selected?._id);
      setBook([]);
      setChapters([]);
      return;
    }

    if (name === "book") {
      const selected = book.find((b) => b._id === value);

      setFormData((prev) => ({ ...prev, book: selected?.bookTitle, bookId: selected?._id || "", chapter: "", chapterId: "" }));
      setErrors((prev) => ({ ...prev, book: undefined }));
      getChapters(formData.syllabus, value);
      setChapters([]);
      return;
    }

    if (name === "chapter") {
      const selected = chapters.find((c) => c._id === value);
      setFormData((prev) => ({
        ...prev,
        chapter: selected?.chaptername,
        chapterId: selected?._id || "",
      }));
      setErrors((prev) => ({ ...prev, chapter: undefined }));
      return;
    }

    // ✅ Generic fallback for other fields lik "question"
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };


  const handleExplanationChange = (value) => {
    setFormData((prev) => ({ ...prev, explanation: value }));
    setErrors((prev) => ({ ...prev, explanation: undefined }));
  };

  // =================== Option Handlers ===================
  const handleOptionTextChange = (index, value) => {
    setFormData((prev) => {
      const newOptions = [...prev.options];
      newOptions[index] = { ...newOptions[index], text: value };
      return { ...prev, options: newOptions };
    });
    setErrors((prev) => ({ ...prev, [`option_${index}`]: undefined }));
  };

  const handleOptionCorrectChange = (value) => {
    const index = parseInt(value.split("-")[1]);
    setFormData((prev) => {
      const newOptions = prev.options.map((option, i) => ({
        ...option,
        isCorrect: i === index,
      }));
      return { ...prev, options: newOptions };
    });
    setErrors((prev) => ({ ...prev, correct: undefined }));
  };

  const handleAddOption = () => {
    const newId = options.length + 1;
    setOptions((prev) => [...prev, newId]);
    setFormData((prev) => ({
      ...prev,
      options: [...prev.options, { id: newId, text: "", isCorrect: false }],
    }));
  };

  const handleDeleteOption = (indexToDelete) => {
    setOptions((prev) => prev.filter((_, index) => index !== indexToDelete));
    setFormData((prev) => ({
      ...prev,
      options: prev.options
        .filter((_, index) => index !== indexToDelete)
        .map((option, index) => ({ ...option, id: index + 1 })),
    }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[`option_${indexToDelete}`];
      return newErrors;
    });
  };

  // =================== Submit Handler ===================
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!validateForm()) {
      snackbarEmitter("Please fill all required fields", "error");
      return;
    }

    setLoading(true);
    const isUpdate = !!question?._id;
    const payload = isUpdate ? { questionId: question._id, question: formData.question, options: formData.options, explanation: formData.explanation } : formData;

    try {
      const endpoint = isUpdate ? "/updateQuestion" : "/uploadQuestions";
      const response = await apiPost(endpoint, payload);
      if (response?.data?.status === 200) {
        setTimeout(() => {
          setLoading(false);
          snackbarEmitter(response.data.message, "success");

          if (report === true) {
            modalClose();
          }
          setFormData((prev) => ({
            syllabus: syllabusNav ? syllabusName : "",
            book: syllabusNav ? bookName : "",
            chapter: syllabusNav ? chapterName : "",
            syllabusId: syllabusNav ? syllabusId : "",
            bookId: syllabusNav ? bookId : "",
            chapterId: syllabusNav ? chapterId : "",
            question: "",
            options: [
              { id: 1, text: "", isCorrect: false },
              { id: 2, text: "", isCorrect: false },
            ],
            explanation: "",
          }));
          setErrors({});
        }, 500);
      } else {
        setLoading(false);
        console.error("Submission failed with response:", response);
        snackbarEmitter(response.data.message, "error");
      }
    } catch (error) {
      setLoading(false);
      console.error("Submission error:", error);
      snackbarEmitter("Something went wrong", "error");
    }
  };

  const handleCancel = () => {
    setFormData({
      syllabus: syllabusName || "",
      syllabusId: syllabusId || "",
      book: bookName || "",
      bookId: bookId || "",
      chapter: chapterName || "",
      chapterId: chapterId || "",
      question: question?.question || "",
      options: question?.options || [
        { id: 1, text: "", isCorrect: false },
        { id: 2, text: "", isCorrect: false },
      ],
      explanation: question?.explanation || "",
    });
    setErrors({});
    setOptions(
      question?.options?.length
        ? question.options.map((_, index) => index + 1)
        : [1, 2]
    );
  };

  const [syllabus, setSyllabus] = useState([]);
  const [book, setBook] = useState([]);
  const [chapters, setChapters] = useState([]);

  const getSyllabus = async () => {
    try {
      const response = await apiGet("/getSyllabus");
      if (response.data.status === 200) {
        setSyllabus(response.data.data); // full syllabus objects
      }
    } catch (error) {
      snackbarEmitter("Something went wrong", "error");
    }
  };

  const getBooks = async (syllabus = "", selectedSyllabusId) => {
    console.log("syllabus id for req", selectedSyllabusId);
    try {

      const response = await apiGet(`/booksBySyllabusId/${selectedSyllabusId}`);
      if (response.data.status === 200) {
        setBook(response.data.data); // full book objects
      }
    } catch (error) {
      snackbarEmitter("Something went wrong", "error");
    }
  };

  const getChapters = async (syllabus = "", book = "") => {
    // console.log("syllabus id for chapters", formData.syllabusId);

    try {

      const response = await apiGet(`/chaptersBySyllabusId/${formData.syllabusId}`);
      if (response.data.status === 200) {
        setChapters(response.data.data); // full chapter objects
      }
    } catch (error) {
      snackbarEmitter("Something went wrong", "error");
    }
  };


  useEffect(() => {
    if (syllabusNav) {
      return;
    }

    getSyllabus();
    // getBooks();
    // getChapters();
  }, []);

  const data = [
    {
      label: "Syllabus",
      name: "syllabus",
      value: formData.syllabusId,
      onChange: handleInputChange,
      error: !!errors.syllabus,
      helperText: errors.syllabus,
      options: syllabusNav
        ? [{ label: syllabusName, value: syllabusId }]
        : syllabus.map(item => ({
          label: item.title,
          value: item._id
        })),
      disabled: report || syllabusNav
    },
    {
      label: "Book",
      name: "book",
      value: formData.bookId,
      onChange: handleInputChange,
      error: !!errors.book,
      helperText: errors.book,
      options: syllabusNav
        ? [{ label: bookName, value: bookId }]
        : book
          // .filter(item => item.syllabusId?._id === formData.syllabusId)
          .map(item => ({
            label: item.bookTitle,
            value: item._id
          })),
      disabled: report || syllabusNav
    },
    {
      label: "Chapter",
      name: "chapter",
      value: formData.chapterId,
      onChange: handleInputChange,
      error: !!errors.chapter,
      helperText: errors.chapter,
      options: syllabusNav
        ? [{ label: chapterName, value: chapterId }]
        : chapters
          .filter(
            item =>
              item.bookId === formData.bookId
            // item.syllabusId?._id === formData.syllabusId
          )
          .map(item => ({
            label: item.chaptername,
            value: item._id
          })),
      disabled: report || syllabusNav
    }
  ];


  //bulk upload

  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleOpenUploadDialog = () => setUploadDialogOpen(true);
  const handleCloseUploadDialog = () => {
    setUploadDialogOpen(false);
    setSelectedFile(null);
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const [bulkLoad, setBulkLoad] = useState(false);

  const handleUpload = async () => {
    if (!selectedFile) {
      snackbarEmitter('File not selected', 'warning');
      return;
    }

    setBulkLoad(true);

    try {

      const reqData = new FormData();
      reqData.append('file', selectedFile);
      reqData.append('syllabus', formData.syllabus);
      reqData.append('book', formData.book);
      reqData.append('chapter', formData.chapter);
      reqData.append('syllabusId', formData.syllabusId);
      reqData.append('bookId', formData.bookId);
      reqData.append('chapterId', formData.chapterId);

      if (formData.syllabus === '' || formData.book === '' || formData.chapter === '') {
        setBulkLoad(false);
        snackbarEmitter('Please select Syllabus, Book and Chapter', 'warning');
        return;
      }

      const response = await apiPostUpload('/uploadQuestionsBulk', reqData);

      setTimeout(() => {
        setBulkLoad(false);
        if (response.data.status === 200) {
          snackbarEmitter(response.data.message, 'success');
          handleCloseUploadDialog();
        }
        else {
          snackbarEmitter(response.data.message, 'error');
          handleCloseUploadDialog();
        }
        // navigate('/admin/trainingQuestion', { state: { category: syllabus.category, syllabusName: formData.syllabus, bookName: formData.book, chapterName: formData.chapter } });

      }, 500);

    } catch (error) {

      snackbarEmitter('Something went wrong', 'error');
    }

  };

  const styles = {
    addImageBox: { display: "flex", justifyContent: "flex-end" },
    addImageButton: {
      backgroundColor: "#EAB308",
      color: "white",
      borderRadius: "10px",
      whiteSpace: "nowrap",
      textTransform: "none",
      fontFamily: "Lexend",
      fontWeight: 300,
      fontSize: "16px",
    },
    questionAreaGrid: { mt: 2, mb: 2 },
    divider: { border: "1px solid #DBDBDB", mb: 2 },
    dividerWithMargin: { border: "1px solid #DBDBDB", mb: 2, mt: 2 },
    optionsHeaderBox: {
      justifyContent: "space-between",
      display: "flex",
      flexWrap: "wrap",
      gap: 2,
    },
    addOptionBox: { width: { xs: "100%", sm: "auto" } },
    addOptionButton: {
      backgroundColor: "#EAB308",
      color: "white",
      borderRadius: "10px",
      whiteSpace: "nowrap",
      textTransform: "none",
      fontFamily: "Lexend",
      fontWeight: 300,
      fontSize: "16px",
    },
    radioFormControl: { mt: 2 },
    optionItemBox: {
      display: "flex",
      width: "100%",
      alignItems: "center",
      mb: 2,
    },
    radio: {
      mt: 2,
      mr: { xs: -2, md: 2 },
      "&.Mui-checked": {
        color: "#EAB308",
      },
    },
    textAreaWrapper: {
      width: "-webkit-fill-available",
      marginLeft: { xs: "20px", md: "100px" },
    },
    deleteButtonBox: {
      display: "flex",
      justifyContent: "flex-end",
      mb: 1,
    },
    deleteButton: {
      padding: 0,
      minWidth: "auto",
      fontWeight: 500,
      textTransform: "none",
      fontFamily: "Jost",
      fontSize: "14px",
    },
    errorText: { color: "#d32f2f", fontSize: "0.75rem", mt: 1 },
    solutionBox: { display: "flex", width: "100%", alignItems: "center" },
    solutionTextArea: {
      width: "-webkit-fill-available",
      marginLeft: { xs: "10px", md: "100px" },
    },
    buttonGroup: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: { xs: "column", sm: "row" },
      gap: 2,
      mt: 4,
    },
    submitButton: {
      px: { xs: 2, sm: 4 },
      width: { xs: "60%", sm: "auto" },
      textTransform: "none",
      backgroundColor: "#EAB308",
      color: "white",
      borderRadius: "10px",
      whiteSpace: "nowrap",
      fontFamily: "Lexend",
      fontWeight: 300,
      fontSize: "16px",
    },
    cancelButton: {
      color: "#fff",
      backgroundColor: "#BF0000",
      borderRadius: "10px",
      px: { xs: 2, sm: 4 },
      textTransform: "none",
      whiteSpace: "nowrap",
      fontFamily: "Lexend",
      fontWeight: 300,
      fontSize: "16px",
    },
  };


  return (
    <>
      <Grid container spacing={2}>
        {data.map((field, index) => (
          <Grid key={index} size={{ xs: 12, md: 4 }}>
            <CustomTextField label={field.label} required select placeholder={field.label} name={field.name} value={field.value} onChange={field.onChange} error={field.error} helperText={field.helperText} SelectProps={{ native: false }} disabled={field.disabled} >
              {field.options.map((item, idx) => (
                <MenuItem key={idx} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </CustomTextField>
          </Grid>
        ))}
        <Grid size={{ xs: 12 }}>
          <Box sx={styles.addImageBox}>
            {/* <Button variant="contained" sx={styles.addImageButton}>+Add Image</Button> */}
          </Box>
        </Grid>
      </Grid>
      <Grid container spacing={2} sx={styles.questionAreaGrid}>
        <Grid size={{ xs: 12, md: 12, sm: 12 }} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} >
          <CustomTypography text="Question" />
          {
            bulkButton && <CustomButton children='Bulk upload' onClick={handleOpenUploadDialog} loading={false} bgColor='#EAB308' sx={{ width: { xs: '40%', md: '15%', sm: '20%' }, fontSize: { xs: '10px', md: '14px', sm: '14px' } }} />
          }

        </Grid>

        <Grid size={{ xs: 12, md: 12 }}>

          <CustomTextArea value={formData.question} onChange={(e) => handleInputChange({ target: { name: "question", value: e.target.value } })} error={!!errors.question} helperText={errors.question} />
        </Grid>


      </Grid>
      <Divider sx={styles.divider} />
      <Box sx={styles.optionsHeaderBox}>
        <CustomTypography text="Select Correct Option" />
        <CustomTypography text="Choices" />
        <Box sx={styles.addOptionBox}>
          <Button onClick={handleAddOption} variant="contained" fullWidth sx={styles.addOptionButton} > +Add Option</Button>
        </Box>
      </Box>
      <FormControl fullWidth sx={styles.radioFormControl} error={!!errors.correct}>
        <RadioGroup onChange={(e) => handleOptionCorrectChange(e.target.value)}>
          {formData.options.map((option, index) => (
            <Box key={option.id} sx={styles.optionItemBox}>
              <Radio value={`option-${index}`} checked={option.isCorrect} sx={styles.radio} />
              <Box sx={styles.textAreaWrapper}>
                <Box sx={styles.deleteButtonBox}>
                  <Button variant="text" color="primary" onClick={() => handleDeleteOption(index)} sx={styles.deleteButton}>Delete</Button>
                </Box>
                <CustomTextArea value={option.text} onChange={(e) => handleOptionTextChange(index, e.target.value)} error={!!errors[`option_${index}`]} helperText={errors[`option_${index}`]} />
              </Box>
            </Box>
          ))}
        </RadioGroup>
        {!!errors.correct && <Box sx={styles.errorText}>{errors.correct}</Box>}
      </FormControl>
      <Divider sx={styles.dividerWithMargin} />
      <Box sx={styles.solutionBox}>
        <CustomTypography text="Solution" />
        <Box sx={styles.solutionTextArea}>
          <CustomTextArea value={formData.explanation} onChange={(e) => handleExplanationChange(e.target.value)} error={!!errors.explanation} helperText={errors.explanation} />
        </Box>
      </Box>
      <Box sx={styles.buttonGroup}>
        <CustomButton onClick={handleSubmit} loading={loading} bgColor="#EAB308" borderRadius="10px" sx={styles.submitButton}>
          {question?._id ? "Update Question" : "Add Question"}
        </CustomButton>
        <Button variant="outlined" onClick={handleCancel} sx={styles.cancelButton}>
          Cancel
        </Button>
      </Box>







      <Dialog open={uploadDialogOpen} onClose={handleCloseUploadDialog}>
        <DialogTitle>Upload File</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Choose a file to upload questions in bulk.
          </Typography>
          <Button
            component="label"
            variant="contained"
            sx={{ mt: 1, p: 1, backgroundColor: '#EAB308', color: 'white' }}
            startIcon={<CloudUploadIcon />}

          >
            <input
              type="file"
              hidden
              accept=".json"
              onChange={handleFileSelect}
            />
          </Button>
          {selectedFile && (
            <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
              {selectedFile.name}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          {/* <Button
                              variant="contained"
                              sx={{ backgroundColor: 'orange', color: 'white' }}
                              onClick={handleUpload}
                          >
                              Upload
                          </Button> */}
          <CustomButton children='Upload' onClick={handleUpload} loading={bulkLoad} bgColor='#EAB308' sx={{ width: { xs: '90%', md: '50%', sm: '60%' }, fontSize: { xs: '12px', md: '14px', sm: '14px' } }} />
          {/* <Button onClick={handleCloseUploadDialog} >
                              Cancel
                          </Button> */}
          <CustomButton children='Cancel' onClick={handleCloseUploadDialog} loading={false} bgColor='#CB1D02' sx={{ width: { xs: '90%', md: '50%', sm: '60%' }, fontSize: { xs: '12px', md: '14px', sm: '14px' } }} />
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Training;