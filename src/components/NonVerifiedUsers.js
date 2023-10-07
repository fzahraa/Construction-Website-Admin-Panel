import React, { useState, useEffect } from "react";
import Spinner from "../utils/Spinner";
import styled from "styled-components";
import ReactPaginate from "react-paginate";
import { Button, CircularProgress } from "@mui/material";
import { fetchNonVerifiedUsers } from "../features/admin/adminSlice";
import { useDispatch, useSelector } from "react-redux";
import RefreshIcon from '@mui/icons-material/Refresh';
import axios from "axios";
import { toast } from 'react-toastify';
import DoneIcon from '@mui/icons-material/Done';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import CloseIcon from '@mui/icons-material/Close';
import GppBadIcon from '@mui/icons-material/GppBad';

const NonVerifiedUsers = () => {

    const dispatch = useDispatch();

    const { isLoading, nonVerifiedUsers } = useSelector(
        (state) => state.admin
    );

    const [btnActive, setBtnActive] = useState("");
    const [update, setUpdate] = useState(0);

    const [pageNumber, setPageNumber] = useState(0);
    const usersPerPage = 10;
    const pagesVisited = pageNumber * usersPerPage;
    const pageCount = Math.ceil(nonVerifiedUsers.length / usersPerPage);

    const changePage = ({ selected }) => {
        setPageNumber(selected);
    };

    useEffect(() => {
        dispatch(fetchNonVerifiedUsers());
        // eslint-disable-next-line
    }, [update]);

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
                    <p>Verify CRN</p>
                </div>
                <Spinner />
            </Wrapper>
        );
    }

    return (
        <Wrapper>
            <div className="table__refresh">
                <h1>SEARCH RESULTS: {nonVerifiedUsers.length}</h1>
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
                <p>Verify CRN</p>
            </div>


            {nonVerifiedUsers.slice(pagesVisited, pagesVisited + usersPerPage).map((record, index) => {
                console.log(record);
                return (
                    <div key={index} className="table__records">
                        <p>{record.user.name_en}</p>
                        <p>{record.about_en.name}</p>
                        <p>{record.contact_en.number}</p>
                        <p>{record.processingRegistrationNumber === "" ? record.about_en.registrationNumber : record.processingRegistrationNumber}</p>
                        <p>
                            <Button
                                variant="contained"
                                className="table__btn"
                                id={`btn${index}`}
                                color="success"
                                endIcon={btnActive === `btn${index}` && <CircularProgress size="2rem" color="action" />}
                                onClick={() => {

                                    setBtnActive(`btn${index}`);

                                    axios.patch("http://localhost:8000/api/admin/updateProfile", { id: record._id, crnVerified: true, registrationNumber :  record.processingRegistrationNumber === "" ? record.about_en.registrationNumber : record.processingRegistrationNumber}).then((response) => {

                                        setBtnActive("Verified");

                                        if (response.data.status === "SUCCESS") {
                                            toast.success("CRN is verified", {
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
                                endIcon={btnActive === `btn${index}` && <CircularProgress size="2rem" color="action" />}
                                onClick={() => {

                                    setBtnActive(`btn${index}`);

                                    axios.patch("http://localhost:8000/api/admin/updateProfileForNonVerify", { id: record._id, crnVerified: false }).then((response) => {

                                        setBtnActive("Verified");

                                        if (response.data.status === "SUCCESS") {
                                            toast.success("CRN is marked as NON-Verified", {
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

export default NonVerifiedUsers;

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
    padding: 1.5rem;
  }

  .table__fields,
  .table__records {
    display: grid;
    text-align: center;
    align-items: center;
    grid-template-columns: 2fr 2fr 2fr 2fr 2fr;
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
