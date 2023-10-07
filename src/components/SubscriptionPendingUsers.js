import React, { useState, useEffect } from "react";
import Spinner from "../utils/Spinner";
import styled from "styled-components";
import ReactPaginate from "react-paginate";
import { Button, CircularProgress } from "@mui/material";
import { fetchNonVerifiedUsers, fetchSubscriptionPendingUsers } from "../features/admin/adminSlice";
import { useDispatch, useSelector } from "react-redux";
import RefreshIcon from '@mui/icons-material/Refresh';
import axios from "axios";
import { toast } from 'react-toastify';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import DoneIcon from '@mui/icons-material/Done';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import CloseIcon from '@mui/icons-material/Close';
import GppBadIcon from '@mui/icons-material/GppBad';

const SubscriptionPendingUsers = () => {

  const dispatch = useDispatch();
  const [clickedState, setClickedState] = useState(false);


  const { isLoading, subscriptionPendingUsers } = useSelector(
    (state) => state.admin
  );

  const [btnActive, setBtnActive] = useState("");
  const [update, setUpdate] = useState(0);
  const [image, setImage] = useState("");

  const [pageNumber, setPageNumber] = useState(0);
  const usersPerPage = 10;
  const pagesVisited = pageNumber * usersPerPage;
  const pageCount = Math.ceil(subscriptionPendingUsers.length / usersPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  useEffect(() => {
    dispatch(fetchSubscriptionPendingUsers());
    // eslint-disable-next-line
  }, [update]);

  const openImage = (img) => {
    setImage(img);
    setClickedState(!clickedState);

  };

  if (isLoading) {
    return (
      <Wrapper>
        <div className="table__refresh">
          <h1>SEARCH RESULTS</h1>
          <Button
            variant="contained"
            className="table__btn"
            color="secondary"
            endIcon={<RefreshIcon />}
            onClick={() => dispatch(fetchNonVerifiedUsers())}
          >
            Refresh
          </Button>
        </div>

        <div className="table__fields">
          <p>User Name</p>
          <p>Company Name</p>
          <p>Contact Number</p>
          <p>CRN</p>
          <p>Payment</p>
          <p>Verify CRN</p>
        </div>
        <Spinner />
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <div className="table__refresh">
        <h1>SEARCH RESULTS: {subscriptionPendingUsers.length}</h1>
        <Button
          variant="contained"
          className="table__btn"
          color="secondary"
          endIcon={<RefreshIcon />}
          onClick={() => dispatch(fetchSubscriptionPendingUsers())}
        >
          Refresh
        </Button>
      </div>

      <div className="table__fields">
        <p>User Name</p>
        <p>Company Name</p>
        <p>Subscription Package</p>
        <p>Payment</p>
        <p>Verify Subscription</p>
      </div>


      {subscriptionPendingUsers.slice(pagesVisited, pagesVisited + usersPerPage).map((record, index) => {
        return (
          <div key={index} className="table__records">
            <p>{record.user.name_en}</p>
            <p>{record.about_en.name}</p>
            {record.newSubscriptionPackage === "63729a38fbacd37e4ce56082" &&
            <p>Starter</p>
            }
            {record.newSubscriptionPackage === "637298f6fbacd37e4ce56081" &&
            <p>Silver</p>
            }
            {record.newSubscriptionPackage === "637298f6fbacd37e4ce56080" &&
            <p>Gold</p>
            }
            <p><CameraAltIcon onClick={() => openImage(record.subscriptionVerificationImage)} style={{ "fontSize": "30px", "cursor": "pointer" }} /></p>
            {clickedState && (
              <div
                className="dialog"
                onClick={() => openImage(record.subscriptionVerificationImage)}
              >
                <img
                  className="receipt"
                  src={image}
                  onClick={() => openImage(record.subscriptionVerificationImage)}
                  alt="receipt"
                />
              </div>
            )}
            <p>
              <Button
                variant="contained"
                className="table__btn"
                id={`btn${index}`}
                color="success"
                endIcon={btnActive === `btn${index}` && <CircularProgress size="2rem" color="action"/>}
                onClick={() => {
                  setBtnActive(`btn${index}`);

                  axios.patch("http://localhost:8000/api/admin/updateSubsProfile", { id: record._id, subscriptionVerified: true, newSubscriptionPackage: record.newSubscriptionPackage }).then((response) => {
                    setBtnActive("Verified");

                    if (response.data.status === "SUCCESS") {
                      toast.success("Subscription is verified", {
                        position: "top-center",
                      });
                      setTimeout(() => {
                        setBtnActive("");
                        setUpdate(Math.random());
                      }, 2000);
                    }
                    else if (response.data.status === "FAILURE") {
                      toast.success(response.data.message, {
                        position: "top-center",
                      });
                    }

                  })
                }}
              >
               {btnActive === `btn${index}` ? <RestartAltIcon /> : btnActive === "Verified" ? <VerifiedUserIcon /> : <DoneIcon />}
              </Button>
              <Button
                variant="contained"
                className="table__btn"
                id={`btn${index}`}
                color="success"
                endIcon={btnActive === `btn${index}` && <CircularProgress size="2rem" color="action"/>}
                onClick={() => {
                  setBtnActive(`btn${index}`);

                  axios.patch("http://localhost:8000/api/admin/updateSubsProfile", { id: record._id, subscriptionVerified: false, newSubscriptionPackage: record.newSubscriptionPackage }).then((response) => {
                    setBtnActive("Verified");

                    if (response.data.status === "SUCCESS") {
                      toast.success("Subscription is marked as Non-Verified", {
                        position: "top-center",
                      });
                      setTimeout(() => {
                        setBtnActive("");
                        setUpdate(Math.random());
                      }, 2000);
                    }
                    else if (response.data.status === "FAILURE") {
                      toast.success(response.data.message, {
                        position: "top-center",
                      });
                    }

                  })
                }}
              >
                {btnActive === `btn${index}` ? <RestartAltIcon /> : btnActive === "Verified" ? <GppBadIcon /> : <CloseIcon />}
              </Button>
            </p>
          </div>
        );
      })
      }

      <ReactPaginate
        previousLabel={"Prev"}
        nextLabel={"Next"}
        pageCount={pageCount}
        onPageChange={changePage}
        containerClassName={"paginationBttns"}
        previousLinkClassName={"previousBttn"}
        nextLinkClassName={"nextBttn"}
        disabledClassName={"paginationDisabled"}
        activeClassName={"paginationActive"}
      />

    </Wrapper>
  );
};

export default SubscriptionPendingUsers;

const Wrapper = styled.div`
    width: 100%;
    min-height: 40rem;
    position: relative;

    .table__refresh {
        font-size: 1rem;
        color: #262626;
        margin: 1rem 0rem;
        padding: 0rem 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    

  .table__btn {
    font-size: 1.5rem;
    margin-right: 3px;
  }

  .table__fields p {
    font-size: 1.8rem;
    font-weight: 500;
    color: white;
    padding: 1.6rem;
  }

  .table__records p{
    font-size: 1.8rem;
    font-weight: 500;
    padding: 1rem;
  }

  .table__fields,
  .table__records {
    display: grid;
    text-align: center;
    align-items: center;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  }

  .table__fields {
    background-color: #424d83;
    border-radius: 8px;
  }

  .table__records {
    margin-top: 3px;
    border-radius: 5px;
    background: #eaeafa;
  }

  .dialog {
    position: absolute;
    width: 100%;
    height: 100vh;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .receipt {
    width: 50rem;
    height: 50rem;
  }

  .paginationBttns {
    list-style: none;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 4rem 0rem;
  }

  .paginationBttns a {
    font-size: 1.4rem;
    padding: 1rem 1.5rem;
    border-radius: 5px;
    color: #2b2eff;
    cursor: pointer;
    margin: 0rem 0.5rem;
    @media only screen and (max-width: 800px) {
      font-size: 1.2rem;
    }
  }

  .paginationActive a {
    color: white;
    background-color: #424d83;
    cursor: pointer;
  }

  .paginationDisabled a {
    color: grey;
    background-color: whitesmoke;
    cursor: not-allowed;
  }


`;
