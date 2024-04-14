import React, { memo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Paper } from "@material-ui/core";
import clsx from "clsx";
import PropTypes from "prop-types";

const useStyles = makeStyles(() => ({
  paper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: "60px",
    paddingLeft: "30px",
    backgroundColor: "#1c2132",
    cursor: "pointer",
    transition: "ease-out 0.4s",
    borderRadius: "5px",
    border: "none",
    "&:hover": {
      transform: "translateY(-5px)",
    },
  },
  selected: {
    // border: "1px solid #FFFFFF",
    border: "none",
  },
  icon: {
    width: 40,
    height: 40,
  },
  label: {
    fontWeight: "bold",
    color: "white",
    marginLeft: "30px",
  },
}));

const WalletCard = ({ name, selected }) => {
  const classes = useStyles();

  return (
    <Paper className={clsx(classes.paper, { [classes.selected]: selected })}>
      <img
        className={classes.icon}
        src={`/assets/images/wallet/${name}.png`}
        alt="Logo"
      />
      <Typography variant="h6" className={classes.label}>
        {name}
      </Typography>
    </Paper>
  );
};

WalletCard.propTypes = {
  name: PropTypes.node,
  selected: PropTypes.node,
};

export default memo(WalletCard);
