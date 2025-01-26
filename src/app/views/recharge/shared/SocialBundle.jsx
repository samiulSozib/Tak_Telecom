import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Card,
  Table,
  Select,
  Avatar,
  styled,
  TableRow,
  useTheme,
  MenuItem,
  TableBody,
  TableCell,
  TableHead,
  IconButton,
  TablePagination,
  TextField,
  Button,
  Modal,
  Typography,
  Grid,
  InputAdornment,
  Paper,
  CircularProgress,
  useMediaQuery,
  CardContent,
  Divider
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import DialpadIcon from '@mui/icons-material/Dialpad';
import { H3, H4, H5, H6, Paragraph } from "app/components/Typography";
import { useLocation } from "react-router-dom";
import {getBundles} from '../../../redux/actions/bundleAction'
import {placeOrder,confirmPin,clearMessages} from '../../../redux/actions/rechargeAction'
import { useDispatch, useSelector } from "react-redux";
import { useEffect,useState } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import { motion } from "framer-motion";


// STYLED COMPONENTS
const CardHeader = styled(Box)(() => ({
  display: "flex",
  paddingLeft: "24px",
  paddingRight: "24px",
  marginBottom: "12px",
  alignItems: "center",
  justifyContent: "space-between"
}));

const Title = styled("span")(() => ({
  fontSize: "1rem",
  fontWeight: "500",
  textTransform: "capitalize"
}));

const ProductTable = styled(Table)(() => ({
  whiteSpace: "pre",
  "& small": {
    width: 50,
    height: 15,
    borderRadius: 500,
    boxShadow: "0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.24)"
  },
  "& td": { borderBottom: "none" },
  "& td:first-of-type": { paddingLeft: "16px !important" }
}));

const Small = styled("small")(({ bgcolor }) => ({
  width: 50,
  height: 15,
  color: "#fff",
  padding: "2px 8px",
  borderRadius: "4px",
  overflow: "hidden",
  background: bgcolor,
  boxShadow: "0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.24)"
}));

const ImageListContainer = styled(Box)(() => ({
  display: "flex",
  overflowX: "auto",
  padding: "8px 0",
  gap: "16px", // spacing between each image card
  "& > div": {
    padding: "8px", // padding inside each Card
  },
  "& img": {
    height: "60px",
    borderRadius: "4px",
    objectFit: "cover",
  },
  
}));

const ImageContainer = styled(Box)(({ theme }) => ({
  width: 180,
  height: 150,
  marginRight: 16,
  display: "flex", // Enable flexbox
  alignItems: "center", // Center items vertically
  justifyContent: "center", // Center items horizontally
  borderRadius: "10px",
  overflow: "hidden",
}));

const Label = styled(Typography)(({ theme }) => ({
  fontSize: "0.7rem",
  color: theme.palette.text.secondary,
}));
const Value = styled(Typography)(({ theme }) => ({
  fontSize: "0.7rem",
  fontWeight: 500,
}));

export default function SocialBundle() {
  const { palette } = useTheme();
  const bgError = palette.error.main;
  const bgPrimary = palette.primary.main;
  const bgSecondary = palette.secondary.main;

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const countryId = queryParams.get('countryId');
  const categoryId = queryParams.get('categoryId');
  const companyId=queryParams.get('companyId')
  const [searchTag,setSearchTag]=useState("")
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [selectedBundle, setSelectedBundle] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [pin,setPin]=useState("")
  const [number,setNumber]=useState("")
  const { error,orderPlaced,message,loading } = useSelector((state) => state.rechargeReducer);
  const {user_info}=useSelector((state)=>state.auth)
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar" || i18n.language === "fa" || i18n.language === "ps";
  const [errorMessage,setErrorMessage]=useState("")




  const dispatch=useDispatch()
  const {bundleList,total_items}=useSelector((state)=>state.bundleListReducer)
  const [visibleRows, setVisibleRows] = useState({});

  


  useEffect(()=>{
    dispatch(getBundles(page+1,rowsPerPage,countryId,"",companyId,categoryId,searchTag))
  },[dispatch,searchTag,page,rowsPerPage])

  const handleVisibilityToggle = (index) => {
    setVisibleRows((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleBundleSelect = (bundle) => {
    //if(number.length===0){
      //toast.error(t('ENTER_YOUR_NUMBER'))
      //return;
    //}
    //console.log(bundle)
      setSelectedBundle(bundle);
      setModalOpen(true);
    
  };

  // useEffect(()=>{
  //   //console.log(selectedBundle)
  // },[selectedBundle])



   //const handleCloseModal = () => setModalOpen(false);
   const handleCloseModal=()=>{
    setModalOpen(false)
    setErrorMessage("")
    setNumber("")
  }

  const checkPIN=()=>{
    dispatch(confirmPin(pin,selectedBundle.id,number))
  }


  useEffect(()=>{
    if(message || error){
    if(orderPlaced){
      Swal.fire({
        title: "Good job!",
        text: message,
        icon: "success"
      });
      dispatch(clearMessages())
      handleCloseModal()
    }
    if(error){
      setErrorMessage(error)
      dispatch(clearMessages())
    }
    }
  },[dispatch,orderPlaced,error,message])

  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 },
  };


  return (
    <Card sx={{ pt: "20px", mb: 3 }}>
      
      <Paper elevation={5}>
        <Card sx={{ pt: "10px", mb: 1 }}>
        <CardHeader
          sx={{
            p: 2, // Reduced padding for a smaller header
            backgroundColor: '#f9f9f9',
            borderRadius: '8px',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Grid container spacing={2} direction="row" justifyContent="center" alignItems="center">
            {/* Search Field */}
            <Grid item xs={12} sm={6} md={6} lg={5} xl={5}>
              <TextField
                margin="dense" // Compact margin
                label={t('SEARCH')}
                size="small" // Smaller input size
                variant="outlined"
                fullWidth
                onChange={(e) => setSearchTag(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#6c757d' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  backgroundColor: '#ffffff',
                  borderRadius: '8px',
                  boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#007bff',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#007bff',
                    },
                  },
                }}
              />
            </Grid>

            {/* Number Input Field */}
            <Grid item xs={12} sm={6} md={6} lg={5} xl={5}>
              <TextField
                type="number"
                margin="dense" // Compact margin
                label={t('ENTER_YOUR_NUMBER')}
                size="small" // Smaller input size
                variant="outlined"
                fullWidth
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <DialpadIcon sx={{ color: '#6c757d' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  backgroundColor: '#ffffff',
                  borderRadius: '8px',
                  boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
                  '& input[type=number]': {
                    '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
                      WebkitAppearance: 'none',
                      margin: 0,
                    },
                    MozAppearance: 'textfield',
                  },
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#007bff',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#007bff',
                    },
                  },
                }}
              />
            </Grid>
          </Grid>
        </CardHeader>


        </Card>
      </Paper>
      


      

      <Box overflow="auto">

            {isSmallScreen?(
              <ProductTable sx={{ padding: "1px" }}>
              <TableBody>
                {bundleList.map((bundle, index) => (
                  <motion.div
                  key={index}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <Card key={index} sx={{ mb: 1,height:"70px",paddingBottom:"1px", opacity: 0.9}} onClick={() => handleBundleSelect(bundle)} >
                    <CardContent sx={{ display: 'flex',justifyContent:'space-between', alignItems: 'center', gap: 1 }}>
                      
                      {/* Logo Section */}
                      <Box sx={{flex:2.5,  display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar src={bundle.service.company.company_logo} />
                        {/* Bundle Info Section */}
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          flexDirection: 'column', 
                          gap: 0.1, 
                          wordWrap: 'break-word', // Ensures text wraps to next line if too long
                          overflow: 'hidden', // Prevents overflow
                          textOverflow: 'ellipsis', // Adds ellipsis if content is too long
                          whiteSpace: 'normal', // Allows wrapping of text
                        }}
                      >
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: 'bold', 
                            textTransform: 'capitalize', 
                            fontSize: '10px' // Set font size to 12px
                          }}
                        >
                          {bundle.bundle_title}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            textTransform: 'capitalize', 
                            fontSize: '10px' // Set font size to 12px
                          }}
                        >
                          {bundle?.validity_type?.charAt(0).toUpperCase() + bundle?.validity_type?.slice(1)}
                        </Typography>
                      </Box>
                      </Box>
                      
                      
                      
                      {/* Sell Price Section */}
                      <Box 
                        sx={{
                          flex:1,
                          display: 'flex', 
                          flexDirection: 'column', 
                          alignItems: 'center', 
                          gap: 0.5,
                          textOverflow: 'ellipsis', // Ensures that long text will be truncated with ellipsis
                          overflow: 'hidden', // Prevents text overflow
                          whiteSpace: 'nowrap', // Prevents wrapping of text
                        }}
                      >
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            fontWeight: 'bold', 
                            fontSize: '10px' // Set font size to 12px
                          }}
                        >
                          {t('SELL')}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            fontWeight: 'bold', 
                            fontSize: '10px' // Set font size to 12px
                          }}
                        >
                          {bundle.selling_price} {user_info.currency.code}
                        </Typography>
                      </Box>
                      
                      {/* Buy Price Section */}
                      <Box 
                        sx={{ 
                          flex:1,
                          display: 'flex', 
                          flexDirection: 'column', 
                          alignItems: 'center', 
                          gap: 0.5,
                          textOverflow: 'ellipsis', // Adds ellipsis for overflow
                          overflow: 'hidden', // Hides overflow content
                          whiteSpace: 'nowrap', // Prevents wrapping of text
                        }}
                      >
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            fontWeight: 'bold', 
                            fontSize: '10px' // Set font size to 12px
                          }}
                        >
                          {t('BUY')}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            fontWeight: 'bold', 
                            fontSize: '10px' // Set font size to 12px
                          }}
                        >
                          {visibleRows[index] ? `${bundle.buying_price} ${user_info.currency.code}` : "****"}
                        </Typography>
                      </Box>
                      
                      {/* Visibility Toggle Button */}
                      <IconButton onClick={() => handleVisibilityToggle(index)}>
                        {visibleRows[index] ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </CardContent>
                  </Card>   
                  </motion.div>
                  
                  ))}
              </TableBody>
            </ProductTable>
            ):(
              <Grid container spacing={2} dir={isRtl?'rtl':'ltr'}>
              {bundleList.map((bundle, index) => (
                
                <Grid key={index} item xs={12} md={6} lg={3} xl={2} sx={{ mt:"2px", transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)' } }}>
                  <motion.div
                  key={index}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <Card
                    sx={{
                      cursor: "pointer",
                      maxHeight: "250px",
                      minHeight: "250px",
                      textAlign: "center",
                      padding: 3,
                      borderRadius: "12px",
                      backgroundColor:'#D3D3D3',
                      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                      transition: "transform 0.3s, box-shadow 0.3s",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      "&:hover": {
                        transform: "scale(1.05)",
                        boxShadow: "0 6px 15px rgba(0, 0, 0, 0.2)",
                      },
                    }}
                    onClick={() => handleBundleSelect(bundle)}
                  >
                    {/* Logo Section */}
                    <Box
                      sx={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                        overflow: "hidden",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        border: "2px solid #f0f0f0",
                      }}
                    >
                      <img
                        src={bundle.service.company.company_logo}
                        alt="Company Logo"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                        }}
                      />
                    </Box>

                    {/* Title and Validity */}
                    <Box sx={{ flex: 1, width: "100%", textAlign: "center" }}>
                      <H4 sx={{ fontSize: "1.2rem", fontWeight: "bold", color: "#333", mb: 1 }}>
                        {bundle.bundle_title}
                      </H4>
                      <H5
                        sx={{
                          fontSize: "0.9rem",
                          color: "#666",
                          textTransform: "uppercase",
                        }}
                      >
                        {t(`${bundle?.validity_type?.toUpperCase()}`)}
                      </H5>
                    </Box>

                    {/* Price Section */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                        borderTop: "1px solid #e0e0e0",
                        pt: 2,
                        mt: 1,
                      }}
                    >
                      <Box sx={{ textAlign: "left" }}>
                        <H6
                          sx={{
                            color: "green",
                            fontSize: "0.85rem",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <strong>{t("SELL")}:</strong> {bundle.selling_price}{" "}
                          {user_info.currency.code}
                        </H6>
                      </Box>
                      <Box sx={{ textAlign: "right" }}>
                        <H6
                          sx={{
                            color: "red",
                            fontSize: "0.85rem",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <strong>{t("BUY")}:</strong> {bundle.buying_price}{" "}
                          {user_info.currency.code}
                        </H6>
                      </Box>
                    </Box>
                  </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          )}

        <TablePagination
          sx={{ px: 2 }}
          page={page}
          component="div"
          rowsPerPage={rowsPerPage}
          count={total_items}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[10, 20, 30]}
          onRowsPerPageChange={handleChangeRowsPerPage}
          nextIconButtonProps={{ "aria-label": "Next Page" }}
          backIconButtonProps={{ "aria-label": "Previous Page" }}
      />
      </Box>

      {/* Modal for PIN */}
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 350,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" mb={2}>{t('CONFIRM_YOUR_PIN')}</Typography>

          {selectedBundle && (
                      <Box sx={{
                        border: '1px solid black', 
                          borderRadius: '8px',      
                          padding: '5px',
                          marginBottom:'5px'
                        }}>
                        <Box display="flex" justifyContent="space-between" my={1}>
                          <Label sx={{ color: "black" }}>{t('BUNDLE_TITLE')}</Label>
                          <Value>{selectedBundle.bundle_title}</Value>
                        </Box>
                        <Box display="flex" justifyContent="space-between" my={1}>
                          <Label sx={{ color: "black" }}>{t('VALIDITY_TYPE')}</Label>
                          <Value>{selectedBundle.validity_type}</Value>
                        </Box>
                        <Box display="flex" justifyContent="space-between" my={1}>
                          <Label sx={{ color: "black" }}>{t('SELLING_PRICE')}</Label>
                          <Value>{user_info.currency.code} {selectedBundle.selling_price}</Value>
                        </Box>
                        <Box display="flex" justifyContent="space-between" my={1}>
                        <Label sx={{ color: "black" }}>{t('COMPANY')}</Label>
                          <img src={selectedBundle?.service?.company?.company_logo} width="32px" height="32px" alt="" />
                        </Box>
                      </Box>
                    )}
          
          <TextField
                  type="number"
                  margin="dense"
                  label={t('ENTER_YOUR_NUMBER')}
                  variant="outlined"
                  fullWidth 
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <DialpadIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& input[type=number]': {
                      // Hides the spinner in Chrome, Safari, Edge, and other WebKit browsers
                      '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
                        WebkitAppearance: 'none',
                        margin: 0,
                      },
                      // Hides the spinner in Firefox
                      MozAppearance: 'textfield',
                    },
                  }}
                />

          {/* Input Box */}
          <TextField
        
            fullWidth
            label={t('ENTER_YOUR_PIN')}
            variant="outlined"
            sx={{ mt: 2 }}
            onChange={(e)=>setPin(e.target.value)}
            inputProps={{
              maxLength: 4,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <DialpadIcon />
                </InputAdornment>
              ),
            }}
          />

          {errorMessage && (
          <Typography variant="body2" color="error" sx={{ mt: 1,mb:1 }}>
            {errorMessage}
          </Typography>
        )}
          {/* Buttons */}
          {loading? (
            <Box 
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%", // or a fixed height if needed
              mt: 3
            }}
            >
            <CircularProgress />
          </Box>
          ):(
          <Box
            sx={{ 
              display: "flex", 
              justifyContent: isRtl ? "space-between" : "space-between", // Adjusted based on direction
              mt: 3,
              flexDirection: isRtl ? "row-reverse" : "row" // Reverse the order of buttons in RTL
            }}
            dir={isRtl ? "rtl" : "ltr"}
          >
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleCloseModal}
            >
              {t('CANCEL')}
            </Button>

            <Button
              variant="contained"
              color="primary"
              onClick={checkPIN}
              disabled={ number.length<3 }
            >
              {t('VERIFY')}
            </Button>
          </Box>
          )}
        </Box>
      </Modal>
      <ToastContainer/>
    </Card>
  );
}
