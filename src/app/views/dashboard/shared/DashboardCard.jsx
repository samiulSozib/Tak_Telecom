import { AttachMoney, MonetizationOn, ShoppingCart } from "@mui/icons-material";
import { Box, Card, Fab, Grid, styled, useMediaQuery, useTheme } from "@mui/material";
import { dashboardData } from '../../../redux/actions/dashboardAction';
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { H5 } from "app/components/Typography";
import { motion } from "framer-motion"; 


// STYLED COMPONENTS
const ContentBox = styled("div")(() => ({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
}));

const FabIcon = styled(Fab)(() => ({
  width: "32px !important",
  height: "32px !important",
  boxShadow: "none !important",
}));



const ValueText = styled("h3")(({ theme }) => ({
  margin: 0,
  fontWeight: "bold",
  color: '#fff',
}));

export default function DashboardCard() {
  const { palette } = useTheme();
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { information } = useSelector((state) => state.dashboardReducer);
  const { user_info } = useSelector((state) => state.auth);
  const isRtl = ["ar", "fa", "ps"].includes(i18n.language);

  useEffect(() => {
    dispatch(dashboardData());
  }, [dispatch]);

  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));


  const cardItems = [
    { label: 'BALANCE', icon: <AttachMoney />, value: information.balance, color: "#4caf50" },
    { label: 'LOAN_BALANCE', icon: <MonetizationOn />, value: information.loan_balance, color: "#f44336" },
    { label: 'SALE', icon: <ShoppingCart />, value: [{title:'TODAY_SALE',val:information.today_sale}, {title:'TOTAL_SALE',val:information.total_sold_amount}], color: "#9c27b0" },
    { label: 'PROFIT', icon: <AttachMoney />, value: [{title:'TODAY_PROFIT',val:information.today_profit}, {title:'TOTAL_PROFIT',val:information.total_revenue}], color: "#3f51b5" },
  ];

  const cardVariants = {
    initial: { opacity: 0, rotateY: -90 }, // Starts flipped
    animate: { opacity: 1, rotateY: 0, transition: { duration: 0.6, ease: "easeInOut" } }, // Flips into place
    hover: { scale: 1, rotateY: 10, transition: { type: "spring", stiffness: 300 } }, // Slight rotation and bounce
  };


  return (
    <Grid container spacing={1} sx={{ mb: 3 }} dir={isRtl ? 'rtl' : 'ltr'}>
      {cardItems.map((item, index) => (
        <Grid key={index} item xs={6} sm={6} md={6} lg={6} sx={{ transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.02)' } }}>
          <motion.div
          variants={cardVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
          style={{ display: "", height: "100%" }}
          >
            <Card
              elevation={6}
              sx={{
                backgroundColor: item.color,
                borderRadius: "12px",
                color: "#fff",
                position: "relative",
                overflow: "hidden",
                height: isSmallScreen ? "120px" : "160px",
                padding: 2,
              }}
            >
              {/* Decorative Circles */}
              <Box
                sx={{
                  position: "absolute",
                  width: "150px",
                  height: "150px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  top: "-40px",
                  right: "-40px",
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  width: "150px",
                  height: "150px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  top: "40px",
                  right: "40px",
                }}
              />

              {/* First Content Box: Top-Left */}
              <ContentBox
                display="flex"
                alignItems="center"
                textAlign="start"
                sx={{
                  position: "absolute",
                  top: 8,
                  left: 8, // Adjust margins for spacing
                }}
              >
                <FabIcon sx={{ backgroundColor: "rgba(255, 255, 255, 0.3)", color: item.color, ml: isRtl ? 0.5 : "" }}>
                  {item.icon}
                </FabIcon>
                <H5
                  color="textPrimary"
                  sx={{
                    ml: 0.5,
                    fontSize: { xs: "12px", sm: "12px", md: "16px", lg: "18px" },
                  }}
                >
                  {t(item.label)}
                </H5>
              </ContentBox>

              {/* Second Content Box: Bottom-Right */}
              <ContentBox
                sx={{
                  flexDirection: "column",
                  alignItems: "flex-end", // Align content to the right
                  position: "absolute",
                  bottom: 8,
                  right: 8, // Adjust margins for spacing
                }}
              >
                {Array.isArray(item.value)
                  ? item.value.map((data, idx) => (
                      <ValueText key={idx} sx={{ fontSize: { xs: "12px", sm: "12px", md: "16px", lg: "18px" } }}>
                        {t(data.title)}: {data.val} {user_info.currency.code}
                      </ValueText>
                    ))
                  : (
                      <ValueText sx={{ fontSize: { xs: "12px", sm: "12px", md: "16px", lg: "18px" } }}>
                        {item.value} {user_info.currency.code}
                      </ValueText>
                    )}
              </ContentBox>
            </Card>

          </motion.div>
        </Grid>
      ))}
    </Grid>
  );
}
