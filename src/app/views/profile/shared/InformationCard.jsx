import { AttachMoney, MonetizationOn, ShoppingCart } from "@mui/icons-material";
import { Box, Card, Fab, Grid, lighten, styled, useTheme } from "@mui/material";
import { dashboardData } from '../../../redux/actions/dashboardAction';
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

// STYLED COMPONENTS
const ContentBox = styled("div")(() => ({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
}));

const FabIcon = styled(Fab)(() => ({
  width: "44px !important",
  height: "44px !important",
  boxShadow: "none !important"
}));

const H3 = styled("h3")(() => ({
  margin: 0,
  fontWeight: "500",
  marginLeft: "12px"
}));

const H1 = styled("h1")(({ theme }) => ({
  margin: 0,
  flexGrow: 1,
  color: 'white'
}));

export default function InformationCard() {
  const { palette } = useTheme();
  const bgError = lighten(palette.error.main, 0.85);
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar" || i18n.language === "fa" || i18n.language === "ps"; 

  const dispatch = useDispatch();
  const { information } = useSelector((state) => state.dashboardReducer);

  useEffect(() => {
    dispatch(dashboardData());
  }, [dispatch]);

  // Array of card data
  const cardData = [
    { 
      icon: <AttachMoney color="white" />,
      title: t('BALANCE'),
      value: information.balance,
      gradient: "linear-gradient(135deg, #e0f7fa, #b2ebf2)", // Light blue gradient
      color: "#4caf50",
      bgColor: "rgba(9, 182, 109, 0.15)"
    },
    {
      icon: <MonetizationOn color="white" />,
      title: t('LOAN_BALANCE'),
      value: information.loan_balance,
      gradient: "linear-gradient(135deg, #f8bbd0, #f48fb1)", // Light pink gradient
      color: "#f44336",
      bgColor: bgError
    },
    {
      icon: <AttachMoney color="white" />,
      title: t('TOTAL_SOLD_AMOUNT'),
      value: information.total_sold_amount,
      gradient: "linear-gradient(135deg, #e1bee7, #ba68c8)", // Light purple gradient
      color: "#9c27b0",
      bgColor: "rgba(9, 182, 109, 0.15)"
    },
    {
      icon: <AttachMoney color="white" />,
      title: t('TOTAL_REVENUE'),
      value: information.total_revenue,
      gradient: "linear-gradient(135deg, #c8e6c9, #81c784)", // Light green gradient
      color: "#3f51b5",
      bgColor: "rgba(9, 182, 109, 0.15)"
    },
    {
      icon: <ShoppingCart color="white" />,
      title: t('TOTAL_SALE'),
      value: information.today_sale,
      gradient: "linear-gradient(135deg, #ffccbc, #ffab91)", // Light orange gradient
      color: "#08ad6c",
      bgColor: "rgba(9, 182, 109, 0.15)"
    },
    {
      icon: <AttachMoney color="white" />,
      title: t('TOTAL_PROFIT'),
      value: information.today_profit,
      gradient: "linear-gradient(135deg, #fff9c4, #fff59d)", // Light yellow gradient
      color: "#4caf50",
      bgColor: "rgba(9, 182, 109, 0.15)"
    }
  ];

  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      {cardData.map((card, index) => (
        <Grid
          key={index}
          item
          xs={12}
          md={6}
          sx={{ transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)' } }}
        >
          <Card

            elevation={3}
            sx={{
              color:'white',
              fontStyle:'italic',
              position:'relative',
              overflow:'hidden',
              p: 2,
              background: card.color // Apply gradient
            }}
          >
            <Box
                sx={{
                  position: "absolute",
                  width: "150px",
                  height: "150px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(211, 22, 22, 0.2)",
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
                  backgroundColor: "rgba(19, 38, 68, 0.2)",
                  top: "40px",
                  right: "40px",
                }}
              />
            <ContentBox style={{color:'white'}}>
              <FabIcon size="medium" sx={{ ml: isRtl ? 1 : '', background: card.bgColor }}>
                {card.icon}
              </FabIcon>
              <H3 color={card.color}>{card.title}</H3>
            </ContentBox>
            <ContentBox sx={{color:'white', pt: 2 }}>
              <H1>{card.value}</H1>
            </ContentBox>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
