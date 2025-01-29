import React, { useState } from "react";
import {
  CardMedia,
  Card,
  CardActions,
  CardContent,
  Typography,
  Stack,
  Button,
  IconButton,
} from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Add from "@mui/icons-material/Add";
import Remove from "@mui/icons-material/Remove";
import { useNavigate } from "react-router-dom";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
  maxWidth: 300,
  bgcolor: "background.paper",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

const MenuItemCard = (props) => {
  const { item } = props;
  console.log(item);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const [quantity, setQuantity] = useState(1);
  const [isBuy, setIsBuy] = useState(false);
  const navigate = useNavigate();
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  return (
    <>
      <Card sx={{ maxWidth: 345, minWidth: 300, m: 1 }}>
        <CardMedia
          component="img"
          height="194"
          image={item.image}
          alt="Paella dish"
        />
        <CardContent>
          <Typography variant="h6" color="primary">
            {item.itemName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Category: {item.category}
          </Typography>
          <Typography variant="h6">Price: Rs.{item.price}</Typography>
        </CardContent>
        <Stack direction="row" justifyContent="flex-end">
          <CardActions>
            <Button
              aria-label="add to Cart"
              variant="outlined"
              startIcon={<AddShoppingCartIcon />}
              onClick={() => {
                setIsBuy(false);
                handleOpen();
              }}
            >
              Add to Cart
            </Button>
            <Button
              aria-label="buy"
              variant="contained"
              startIcon={<ShoppingCartCheckoutIcon />}
              onClick={() => {
                setIsBuy(true);
                handleOpen();
              }}
            >
              Buy
            </Button>
          </CardActions>
        </Stack>
      </Card>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style }}>
          <Stack flexDirection="column" spacing={1}>
            <Typography variant="h5">{item.itemName}</Typography>
            <Typography variant="h6">Item Price: {item.price}</Typography>
            <Typography variant="h6">
              Total Price: {item.price * quantity}
            </Typography>
            <Typography variant="h6">Select Quantity:</Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                justifyContent: "center",
                backgroundColor: "#b9b4fd",
                borderRadius: "8px",
              }}
            >
              <IconButton
                size="sm"
                variant="outlined"
                onClick={() => handleQuantityChange(quantity - 1)}
              >
                <Remove />
              </IconButton>
              <Typography fontWeight="md" textColor="text.secondary">
                {quantity}
              </Typography>
              <IconButton
                size="sm"
                variant="outlined"
                onClick={() => handleQuantityChange(quantity + 1)}
              >
                <Add />
              </IconButton>
            </Box>
            {isBuy === false ? (
              <Button
                aria-label="add to Cart"
                variant="contained"
                startIcon={<AddShoppingCartIcon />}
              >
                Add to Cart
              </Button>
            ) : (
              <Button
                aria-label="buy"
                variant="contained"
                startIcon={<ShoppingCartCheckoutIcon />}
                sx={{ color: "white" }}
              >
                Buy
              </Button>
            )}
          </Stack>
        </Box>
      </Modal>
    </>
  );
};
export default MenuItemCard;
