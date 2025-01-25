import { Box, Card, colors, Grid, styled, useMediaQuery } from "@mui/material";
import { H1, H2, H4, H6, Paragraph, Small } from "app/components/Typography";
import { serviceCategories } from '../../../redux/actions/serviceCategoriesAction';
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { categorizeServices } from '../../../utils/utils';
import { useNavigate } from "react-router-dom";
import CustomCard from "./CustomCard";
import { H3,H5 } from "app/components/Typography";
import { motion } from "framer-motion";



const StyledCard1 = styled(Card)(({ theme }) => ({
  
  cursor:"pointer",
  display: "flex",
  flexDirection: "column", // Arrange items in column
  alignItems: "center",
  justifyContent:'center',
  textAlign:'center',
  padding: "4px", // Add padding for spacing
  maxHeight:"100px",
  [theme.breakpoints.down("sm")]: {
    padding: "0.5rem",
    "& .MuiBox-root": {
      marginRight: 0,
      textAlign: "center",
    },
  },
  transition: "transform 0.3s ease", // Smooth scaling on hover
  "&:hover": {
    transform: "scale(1.05)", // Slight scaling effect
  },
}));

// Image container with styling enhancements
const ImageContainer1 = styled(Box)(({ theme }) => ({
  width: "60px", // Smaller width for circular shape within card
  height: "60px", // Same height as width for circle
  borderRadius: "50%", // Make the container circular
  marginBottom:"5px",
  display: "flex", // Center image
  alignItems: "center",
  justifyContent: "center",
  //boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Soft shadow for depth
  
}));

const StyledCard2 = styled(Card)(({ theme }) => ({
  cursor:"pointer",
  display: "flex",
  flexDirection: "column", // Arrange items in column
  alignItems: "center",
  justifyContent:'center',
  textAlign:'center',
  padding: "4px", // Add padding for spacing
  height:"100px",
  [theme.breakpoints.down("sm")]: {
    padding: "0.5rem",
    "& .MuiBox-root": {
      marginRight: 0,
      textAlign: "center",
    },
  },
  transition: "transform 0.3s ease", // Smooth scaling on hover
  "&:hover": {
    transform: "scale(1.05)", // Slight scaling effect
  },
}));

// Image container with styling enhancements
const ImageContainer2 = styled(Box)(({ theme }) => ({
  width: "60px", // Smaller width for circular shape within card
  height: "60px", // Same height as width for circle
  borderRadius: "50%", // Make the container circular
  display: "flex", // Center image
  alignItems: "center",
  justifyContent: "center",
  paddingTop:"5px"
  //boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Soft shadow for depth
  
}));




export default function StatCards() {
  const dispatch = useDispatch();
  const { serviceCategoryList } = useSelector((state) => state.serviceCategoriesReducer);
  const [categorizedServices, setCategorizedServices] = useState({});
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));


  useEffect(() => {
    dispatch(serviceCategories());
  }, [dispatch]);

  useEffect(()=>{
    //console.log(serviceCategories)
  },[dispatch])

  useEffect(() => {
    if (serviceCategoryList) {
      const categorized = categorizeServices(serviceCategoryList);
      //console.log(categorized);
      setCategorizedServices(categorized);
    }
  }, [serviceCategoryList]);

  const handleCategoryClick=(type,countryId,categoryId,companyId)=>{
    if(type=='nonsocial'){
      navigate(`/recharge/default?type=${type}&countryId=${countryId}&categoryId=${categoryId}`);
    }else{
      navigate(`/recharge/default?type=${type}&countryId=${countryId}&categoryId=${categoryId}&companyId=${companyId}`);
    }
  }

  // Framer Motion animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Stagger animation for child elements
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};
  

  return (
    <Box >
      {/* Render Non-Social Services */}
        {Object.keys(categorizedServices.nonsocial || {}).map((country) => (
          
          <Box key={country} sx={{ marginBottom: "-20px" }}>
          <h6 style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "2px" }}>
            {country} Network
          </h6>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Box
              sx={{
                overflowX: "auto", // Enable horizontal scrolling
                whiteSpace: "nowrap", // Prevent wrapping
                display: "flex", // Use flex for horizontal alignment
                gap: 1, // Add gap between cards
                paddingBottom: "8px", // Optional padding at bottom
              }}
            >
              {categorizedServices.nonsocial[country].categories.map((category, index) => (
                <motion.div 
                key={index}
                style={{
                  flex: "0 0 auto",
                }}
                variants={cardVariants}
                >
                <Box
                  key={index}
                  sx={{
                    flex: "0 0 auto", // Prevent items from growing/shrinking
                    width: { xs: "130px", sm: "140px", md: "150px",lg:'160px',xl:'180px' }, // Set fixed, smaller width
                  }}
                >
                  <StyledCard1
                    onClick={() =>
                      handleCategoryClick(
                        "nonsocial",
                        categorizedServices.nonsocial[country].country_id,
                        category.categoryId
                      )
                    }
                  >
                    <ImageContainer1>
                      <img
                        src={categorizedServices.nonsocial[country].countryImage}
                        alt={country}
                        style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
                      />
                    </ImageContainer1>
                    <Box flex="1">
                      <H4 color="text.black" sx={{ fontSize: "14px", fontWeight: "bold", textAlign: "center" }}>
                        {category.categoryName}
                      </H4>
                    </Box>
                  </StyledCard1>
                </Box>
                </motion.div>
              ))}
            </Box>
          </motion.div>
          </Box>


        ))}

      {/* Render Social Services */}
      {Object.keys(categorizedServices.social || {}).map((categoryName) => (
        <Box key={categoryName} sx={{ marginBottom: "16px" }}>
          <h6 style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "8px" }}>
            {categoryName}
          </h6>
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <Grid container spacing={2}>
              {categorizedServices.social[categoryName].companies.map((company, index) => (
                <Grid item xs={6} sm={4} md={3} lg={2} key={index}>
                  <motion.div variants={cardVariants}>
                    <StyledCard2
                      onClick={() =>
                        handleCategoryClick("social", company.countryId, company.categoryId, company.companyId)
                      }
                    >
                      <ImageContainer2>
                        <img
                          src={company.companyLogo}
                          alt={company.companyName}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                            borderRadius:'50%'
                          }}
                        />
                      </ImageContainer2>
                      <Box>
                        {isSmallScreen ? (
                          <p
                            style={{
                              fontSize: "10px",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {company.companyName}
                          </p>
                        ) : (
                          <H6
                            color="text.black"
                            sx={{
                              fontSize: "12px",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {company.companyName}
                          </H6>
                        )}
                      </Box>
                    </StyledCard2>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Box>
      ))}


    </Box>
  );
}
