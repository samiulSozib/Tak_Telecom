import React, { useState, useEffect } from "react";
import {
  Box,
  TablePagination,
  useTheme,
  Card,
  Typography,
  CardContent,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useMediaQuery,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getOrders } from "../../../redux/actions/orderAction";
import { format } from "date-fns";
import InfoModal from "./InfoModal";
import { useTranslation } from "react-i18next";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CancelIcon from '@mui/icons-material/Cancel';
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";


export default function PaginationTable() {
  const { palette } = useTheme();
  const bgPrimary = palette.primary.main;
  const bgError=palette.error.main
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterStatus, setFilterStatus] = useState("");
  const dispatch = useDispatch();
  const { orderList, total_items } = useSelector((state) => state.orderListReducer);
  const { user_info } = useSelector((state) => state.auth);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { t, i18n } = useTranslation();

  const isRtl = i18n.language === "ar" || i18n.language === "fa" || i18n.language === "ps";

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleClickOpen = (order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setSelectedOrder(null);
  };

  useEffect(() => {
    dispatch(getOrders(page + 1, rowsPerPage, filterStatus,""));
  }, [dispatch, page, rowsPerPage, filterStatus]);

  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const getStatusInfo = (status) => {
    switch (status) { 
      case 0:
        return { label: t("PENDING"), color: "orange", icon: <HourglassEmptyIcon fontSize="small" color="action" /> };
      case 1:
        return { label: t("CONFIRMED"), color: "green", icon: <CheckCircleIcon fontSize="small" color="success" /> };
      case 2:
        return { label: t("REJECTED"), color: "red", icon: <ErrorOutlineIcon fontSize="small" color="error" /> };
      default:
        return { label: t("PENDING"), color: "orange", icon: <HourglassEmptyIcon fontSize="small" color="action" /> };
    }
  };

  

  return (
    <Box elevation={3} dir={isRtl ? "rtl" : "ltr"} sx={{ p:"10px",marginTop:"-20px"}}>
      <Box display="flex" justifyContent="flex-end" mb={1}>
        <FormControl size="small" sx={{ minWidth: 120, mr: "2px" }}>
          <InputLabel>{t("STATUS")}</InputLabel>
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            label={t("STATUS")}
          >
            <MenuItem value="">{t("ALL")}</MenuItem>
            <MenuItem value="0">{t("PENDING")}</MenuItem>
            <MenuItem value="1">{t("CONFIRMED")}</MenuItem>
            <MenuItem value="2">{t("REJECTED")}</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box overflow="auto" dir={isRtl ? "rtl" : "ltr"}>
        <Grid container spacing={2}>
          {orderList.map((order, index) => {
            const { label, color, icon } = getStatusInfo(order.status);
            return (
            <Grid
              key={index}
              item
              xs={12}
              sm={12}
              md={4}
              lg={4}
              xl={3}
              sx={{
                cursor: "pointer",
                transition: "transform 0.3s",
                "&:hover": { transform: "scale(1.03)" },
              }}
              onClick={() => handleClickOpen(order)}
            >
              <Paper elevation={6} sx={{ borderRadius: 2, overflow: "hidden" }}>
                <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                  {/* Card Header */}
                  <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{
                          background: "linear-gradient(to right, #6a11cb, #2575fc)", // Gradient color
                          p: 1.5,
                          borderRadius: "6px 6px 0 0", // Rounded top corners
                          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)", // Subtle shadow
                        }}
                      >
                        <Typography
                          sx={{
                            backgroundColor: "rgba(255, 255, 255, 0.8)", // Semi-transparent white
                            color: "#2c3e50",
                            padding: "4px 8px",
                            borderRadius: "8px",
                            fontWeight: 600,
                            fontSize: isSmallScreen ? "12px" : "14px",
                          }}
                        >
                          {format(new Date(order.created_at), "dd MMM yyyy")}
                        </Typography>
                        <Typography
                          sx={{
                            color: "#ffffff", // White text
                            fontWeight: 700,
                            fontSize: isSmallScreen ? "14px" : "16px",
                            textShadow: "0px 1px 2px rgba(0, 0, 0, 0.3)", // Subtle shadow
                          }}
                        >
                          {t("ORDER_ID")} #{order.id}
                        </Typography>
                      </Box>

                  {/* Card Content */}
                  <CardContent sx={{ p: 2, backgroundColor: "#fdf7ff" }}>
                    <Box display="flex" justifyContent="space-between" mb={1.5}>
                      <Box>
                        <Typography
                          sx={{
                            color: "#673ab7",
                            fontWeight: 500,
                            fontSize: isSmallScreen ? "12px" : "14px",
                          }}
                        >
                          {t("RECHARGEABLE_ACCOUNT")}
                        </Typography>
                        <Typography
                          sx={{
                            color: "#4a5568",
                            fontSize: isSmallScreen ? "12px" : "13px",
                          }}
                        >
                          {order.rechargeble_account}
                        </Typography>
                      </Box>
                      <Typography
                        sx={{
                          color: "#718096",
                          fontWeight: 500,
                          fontSize: isSmallScreen ? "12px" : "13px",
                        }}
                      >
                        {label}
                      </Typography>
                    </Box>

                    {/* Divider */}
                    <Box
                      mb={1}
                      borderBottom="2px dashed #d1c4e9"
                      width="100%"
                    />

                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Box>
                        <Typography
                          sx={{
                            color: "#673ab7",
                            fontWeight: 500,
                            fontSize: isSmallScreen ? "12px" : "14px",
                          }}
                        >
                          {t("TITLE")}
                        </Typography>
                        <Typography
                          sx={{
                            color: "#4a5568",
                            fontSize: isSmallScreen ? "12px" : "13px",
                          }}
                        >
                          {order.bundle.bundle_title}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography
                          sx={{
                            color: "#673ab7",
                            fontWeight: 500,
                            fontSize: isSmallScreen ? "12px" : "14px",
                          }}
                        >
                          {t("SALE")}
                        </Typography>
                        <Typography
                          sx={{
                            color: "#2d3748",
                            fontWeight: 600,
                            fontSize: isSmallScreen ? "12px" : "14px",
                          }}
                        >
                          {order.bundle.selling_price} {user_info.currency.code}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography
                          sx={{
                            color: "#673ab7",
                            fontWeight: 500,
                            fontSize: isSmallScreen ? "12px" : "14px",
                          }}
                        >
                          {t("BUY")}
                        </Typography>
                        <Typography
                          sx={{
                            color: "#2d3748",
                            fontWeight: 600,
                            fontSize: isSmallScreen ? "12px" : "14px",
                          }}
                        >
                          {order.bundle.buying_price} {user_info.currency.code}
                        </Typography>
                      </Box>
                    </Box>

                    <Box display="flex" justifyContent="space-between" mt={1}>
                      <Typography
                        sx={{
                          color: "#4a5568",
                          fontWeight: 500,
                          fontSize: isSmallScreen ? "12px" : "13px",
                        }}
                      >
                        {t(`${order.bundle.validity_type.toUpperCase()}`)}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Paper>

            </Grid>
            );
            })}
        </Grid>

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={total_items}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>

      {/* Modal */}
      <InfoModal
        open={modalOpen}
        onClose={handleClose}
        orderDetails={selectedOrder}
        currency_preference_code={user_info.currency.code}
      />
    </Box>
  );
}
