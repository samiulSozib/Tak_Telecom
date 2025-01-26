import {MoreVertOutlined, Visibility, VisibilityOff, WalletOutlined } from "@mui/icons-material";
import {
  Box,
  Card,
  Table,
  Select,
  Avatar,
  styled,
  TableRow,
  useTheme,
  TableCell,
  MenuItem,
  TableBody,
  TableHead,
  IconButton,
  TablePagination,
  TextField,
  Grid,
  Breadcrumbs,
  Link,
  Typography,
  Modal,
  Button,
  DialogActions,
  Dialog,
  DialogTitle,
  DialogContent,
  InputAdornment,
  CircularProgress,
  FormHelperText,
  Paper,
  useMediaQuery,
  CardContent,
  Divider
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import DialpadIcon from '@mui/icons-material/Dialpad';
import { Instagram, SportsBasketball, Twitter } from "@mui/icons-material";
import { useMemo } from "react";
import { H1, H3, H4, H5, H6, Paragraph, Span } from "app/components/Typography";
import { useLocation } from "react-router-dom";
import {getServices} from '../../../redux/actions/serviceAction'
import {getBundles} from '../../../redux/actions/bundleAction'
import {placeOrder,confirmPin,clearMessages} from '../../../redux/actions/rechargeAction'
import {getCountries} from '../../../redux/actions/locationAction'
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
  width:"100%",
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
  cursor:"pointer",
  display: "flex",
  gap: "8px", // spacing between each image card
  
  "& img": {
    borderRadius: "4px",
  },
  
}));

const ImageContainer = styled(Box)(({ theme }) => ({
  width: 180,
  height: 150,
  marginRight: 2,
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





export default function Bundle() {
  const { palette } = useTheme();
  const bgError = palette.error.main;
  const bgPrimary = palette.primary.main;
  const bgSecondary = palette.secondary.main;
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar" || i18n.language === "fa" || i18n.language === "ps";
  const [errorMessage,setErrorMessage]=useState("")


  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const countryId = queryParams.get('countryId');
  const categoryId = queryParams.get('categoryId');

  //console.log('Country ID:', countryId);
  //console.log('Category ID:', categoryId);

  const dispatch=useDispatch()
  const {serviceList}=useSelector((state)=>state.serviceListReducer)
  const {bundleList,total_items}=useSelector((state)=>state.bundleListReducer)
  const {user_info}=useSelector((state)=>state.auth)
  const [visibleRows, setVisibleRows] = useState({});
  const [validity, setValidity] = useState("");
  const [companyId,setCompanyId]=useState("")
  const [searchTag,setSearchTag]=useState("")
  const [number,setNumber]=useState("")
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedBundle, setSelectedBundle] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [pin,setPin]=useState("")
  const [phoneNumberLength,setPhoneNumberLength]=useState("")
  const { message,error,loading, pinConfirmed, orderPlaced } = useSelector((state) => state.rechargeReducer);
  const {countries}=useSelector((state)=>state.locationReducer)



  // const getCompanyIdByPrefix = (prefix) => {
  //   const service = serviceList.find((service) =>
  //     service.company.companycodes.some((code) => prefix.startsWith(code.reserved_digit))
  //   );
  //   return service ? service.company.id : null;
  // };

  // const handlePrefixMatch = (prefix) => {
  //   const matchedCompanyId = getCompanyIdByPrefix(prefix);
  //   setCompanyId(matchedCompanyId || "");
  // };

  useEffect(()=>{
    dispatch(getServices(categoryId,countryId))
    dispatch(getBundles(page+1,rowsPerPage,countryId,validity,companyId,categoryId,searchTag))
    dispatch(getCountries())
  },[dispatch,validity,companyId,searchTag,page,rowsPerPage,categoryId,countryId])


  useEffect(() => {
    
    if (number.length >= 3) { 
      const matchedService = serviceList.find((service) =>
        service.company.companycodes.some((code) => 
          number.startsWith(code.reserved_digit)
        )
      );

      

      //console.log(matchedService.company.id===1)
  
      if (matchedService) {
        setCompanyId(matchedService.company.id);
      } else {
        setCompanyId("");
      }
    }else if(number.length<3 && number.length>0){
      setCompanyId("")
    }
  }, [number, serviceList]);

  const filteredServiceList = useMemo(() => {
    if ((number.length<3 && number.length>=0)) return serviceList; // Return all services if no companyId is set
    return serviceList.filter(service => service.company.id === companyId);
  }, [companyId, serviceList,number.length]);

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
      setSelectedBundle(bundle);
      setModalOpen(true);
    //}
    //console.log(bundle)
    
    if (number.length >= 3) {
      
      const prefix = number.substring(0, 3);
      const matchedService = serviceList.find(service =>
        service.company.companycodes.some(code => prefix.startsWith(code.reserved_digit))
      );
  
      if (!matchedService) {
        toast.error(t('INVALID_PHONE'))
        return;
      }
    }

    if (number.length === parseInt(phoneNumberLength)) {
      setSelectedBundle(bundle);
      setModalOpen(true);
    }
  };

  useEffect(() => {
    const selectedCountry = countries.find(country => country.id === parseInt(countryId));
    
    if (selectedCountry) {
      
      setPhoneNumberLength(selectedCountry.phone_number_length)
    }

}, [ dispatch,countries,phoneNumberLength,countryId]);



  //const handleCloseModal = () => setModalOpen(false);
  const handleCloseModal=()=>{
    setModalOpen(false)
    setErrorMessage("")
    setNumber('')
    setPhoneNumberError("")
    setSelectedBundle(null)

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
      setNumber('')
      dispatch(clearMessages())
      handleCloseModal()
    }
    if(error){
      setErrorMessage(error)
      dispatch(clearMessages())
    }
    }
  },[dispatch,orderPlaced,error,message])



  const handleNumberChange = (e) => {
    const value = e.target.value;
    setNumber(value);
    //console.log(value.length)
  
    if (value.length === 0) {
      setPhoneNumberError("");  // Clear error if input is empty
    } else if (value.length < phoneNumberLength) {
      setPhoneNumberError(`Number should be ${phoneNumberLength} digits.`);
    } else if (value.length === phoneNumberLength) {
      setPhoneNumberError("");  // Clear error if length is correct
    }

    else if (value.length >= 3) {
      
      const prefix = value.substring(0, 3);
      const matchedService = serviceList.find(service =>
        service.company.companycodes.some(code => prefix.startsWith(code.reserved_digit))
      );

      //console.log(matchedService.company.id)
      //console.log(selectedBundle.service.company_id)

      if(selectedBundle){
        if(matchedService.company.id!==selectedBundle.service.company_id){
          setPhoneNumberError(t('INVALID_PHONE'));
        }else{
          setPhoneNumberError("")
        }
      }
      
  
      else if (!matchedService) {
        setPhoneNumberError(t('INVALID_PHONE'));
      } else {
        setPhoneNumberError("");
        setCompanyId(matchedService.company.id);
      }
    } else {
      setCompanyId("");
    }
  };

  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 },
  };
  

  return (
   
    <Card sx={{  mb: 3 }} dir={isRtl?'rtl':'ltr'} >

      <Paper elevation={5}>
        <Card  sx={{ pt: "10px", mb: 3}}>
          <CardHeader>
            <Grid container spacing={1} direction="row" justifyContent="center" alignItems="center">
            <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                <ImageListContainer
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    overflowX: { xs: 'auto', sm: 'auto', lg: 'unset' },
                    '&::-webkit-scrollbar': { display: 'none' },
                    justifyContent: 'center',
                    flexWrap: { lg: 'wrap', xl: 'wrap' }
                    
                  }}
                >
                  {filteredServiceList.map((service, index) => (
                    <Box>
                      <Box sx={{ display: { xs: 'block', sm: 'none' } }} onClick={() => setCompanyId(service.company.id)}> 
                        <Avatar
                          src={service.company.company_logo}
                          alt={service.company.company_name}
                          sx={{
                            width: 45, // Smaller size for Avatar on small screens
                            height: 45,
                          }}
                        />
                    </Box>

                    <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', justifyContent: 'center' }}>
                      <Card
                        elevation={5}
                        key={index}
                        sx={{
                          backgroundColor:'#D3D3D3',
                          minWidth: "90px",
                          minHeight: "90px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: 'transform 0.3s',
                          '&:hover': { transform: 'scale(1.07)' },
                        }}
                        onClick={() => setCompanyId(service.company.id)}
                      >
                        <img
                          src={service.company.company_logo}
                          alt={service.company.company_name}
                          style={{ width: "90px", height: "70px", objectFit: "contain", padding: "2px" }}
                        />
                      </Card>
                    </Box>

                    </Box>
                  ))}
                </ImageListContainer>
                

              </Grid>

              <Grid item xs={12} sm={6} md={6} lg={3} xl={3}>
                <TextField
                  margin="dense"
                  label={t('SEARCH')}
                  size="small"
                  variant="outlined"
                  fullWidth
                  onChange={(e) => setSearchTag(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: 'primary.main' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiInputBase-root': {
                      fontSize: '0.9rem', // Font size
                      fontWeight: 500, // Font weight
                      color: 'text.primary', // Text color
                      backgroundColor: 'background.paper', // Input background
                      borderRadius: '8px', // Rounded corners
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: '0.85rem', // Smaller label font size
                      color: 'text.secondary', // Label text color
                    },
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: 'primary.light', // Border color on hover
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'primary.main', // Border color when focused
                      },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={6} lg={3} xl={3}>
                <TextField
                  type="number"
                  margin="dense"
                  label={t('ENTER_YOUR_NUMBER')}
                  size="small"
                  variant="outlined"
                  fullWidth
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length <= phoneNumberLength) {
                      handleNumberChange(e);
                    }
                  }}
                  value={number}
                  error={Boolean(phoneNumberError)}
                  helperText={phoneNumberError}
                  required
                  inputProps={{
                    min: 0,
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <DialpadIcon sx={{ color: 'primary.main' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiInputBase-root': {
                      fontSize: '0.9rem', // Font size
                      fontWeight: 500, // Font weight
                      color: 'text.primary', // Text color
                      backgroundColor: 'background.paper', // Input background
                      borderRadius: '8px', // Rounded corners
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: '0.85rem', // Smaller label font size
                      color: 'text.secondary', // Label text color
                    },
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: 'secondary.light', // Border color on hover
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'secondary.main', // Border color when focused
                      },
                    },
                    '& input[type=number]': {
                      '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
                        WebkitAppearance: 'none',
                        margin: 0,
                      },
                      MozAppearance: 'textfield',
                    },
                  }}
                />
              </Grid>


              <Box
                sx={{
                  marginTop: 2,
                  display: 'flex',
                  overflowX: 'auto', // Enables horizontal scrolling
                  gap: 2, // Space between items
                  alignItems: 'center', // Aligns items vertically
                  padding: 1,
                  borderRadius: 2,
                  backgroundColor: 'background.paper', // Subtle background
                  boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)', // Light shadow
                }}
              >
                {[
                  { value: '', label: t('ALL') },
                  { value: 'unlimited', label: t('UNLIMITED') },
                  { value: 'monthly', label: t('MONTHLY') },
                  { value: 'weekly', label: t('WEEKLY') },
                  { value: 'daily', label: t('DAILY') },
                  { value: 'hourly', label: t('HOURLY') },
                  { value: 'nightly', label: t('NIGHTLY') },
                ].map((item) => (
                  <Button
                    key={item.value}
                    sx={{
                      padding: '8px 16px', // Adjusted padding
                      borderRadius: '12px', // Semi-rounded button
                      backgroundColor: validity === item.value ? 'secondary.main' : 'background.default',
                      color: validity === item.value ? 'white' : 'text.secondary',
                      fontWeight: validity === item.value ? 'bold' : 'medium',
                      textTransform: 'uppercase', // Uppercase labels
                      fontSize: { xs: '0.75rem', sm: '0.875rem' }, // Responsive font size
                      border: validity === item.value ? '2px solid secondary.light' : '1px solid #ddd', // Border effect
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        backgroundColor: validity === item.value ? 'secondary.dark' : 'primary.light',
                        color: 'white',
                      },
                    }}
                    onClick={() => setValidity(item.value)}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>


              
            </Grid>
            
          </CardHeader>
        </Card>
        
      </Paper>


      <Box overflow="auto" dir={isRtl?'rtl':'ltr'}>

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
                  <Card key={index} sx={{cursor:"pointer", mb: 1,height:"70px",paddingBottom:"1px", opacity: 0.9}} onClick={() => handleBundleSelect(bundle)} >
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
                          {bundle.validity_type.charAt(0).toUpperCase() + bundle.validity_type.slice(1)}
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
      <Modal open={isModalOpen} onClose={handleCloseModal} dir={isRtl?'rtl':'ltr'}>
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
              border: '1px solid black', // Define the border style, width, and color
                borderRadius: '8px',       // Add rounded corners (optional)
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
              {/* user_info.currency.code */}
            </Box>
          )}
          <TextField
                  type="number"
                  margin="dense"
                  label={t('ENTER_YOUR_NUMBER')}
                  size=""
                  variant="outlined"
                  fullWidth // Also use fullWidth for this TextField
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length <= phoneNumberLength) { // Limit to phoneNumberLength
                      handleNumberChange(e); // Call the original onChange handler
                    }
                  }}                  
                  value={number}
                  error={Boolean(phoneNumberError)}
                  helperText={phoneNumberError} 
                  required
                  inputProps={{
                    min: 0,
                  }}
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
            {t('INCORRECT_PIN')}
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
              disabled={!!phoneNumberError || !number }
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

