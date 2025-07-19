import React, { useEffect, useState } from "react";
import {
    Container,
    Card,
    Table,
    Button,
    Spinner,
    Form,
    Row,
    Col,
    Badge,
    ButtonGroup,
    Modal
} from "react-bootstrap";
import { FaMoneyBillWave, FaStar, FaNotesMedical, FaTrash, FaEye } from "react-icons/fa";
import Swal from "sweetalert2";

const StudentClasses = ({ studentId }) => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [noteLinks, setNoteLinks] = useState({});
    const [ratings, setRatings] = useState({});
    const [filter, setFilter] = useState("all");
    const [showNotesModal, setShowNotesModal] = useState(false);
    const [currentNotes, setCurrentNotes] = useState("");

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                setLoading(true);
                const res = await fetch("http://localhost:5000/api/classes");
                const data = await res.json();
                const filtered = data.filter((cls) => cls.studentId === studentId);
                
                // Update status for upcoming classes that have passed
                const updatedClasses = filtered.map(cls => {
                    const now = new Date();
                    const classDate = new Date(cls.classDate);
                    
                    if (cls.status === "upcoming" && classDate < now) {
                        return { ...cls, status: "incompleted" };
                    }
                    return cls;
                });
                
                setClasses(updatedClasses);
            } catch (error) {
                console.error("Failed to fetch classes:", error);
                Swal.fire("Error", "Failed to load classes", "error");
            } finally {
                setLoading(false);
            }
        };
        fetchClasses();
    }, [studentId]);

    const handleNoteChange = (classId, value) => {
        setNoteLinks((prev) => ({ ...prev, [classId]: value }));
    };

    const handleSaveNote = async (classId) => {
        const notesLink = noteLinks[classId];
        if (!notesLink) return;
        
        try {
            const res = await fetch(`http://localhost:5000/api/classes/${classId}/addNote`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ notesLink }),
            });
            
            if (!res.ok) throw new Error("Failed to save notes");
            
            const updated = await res.json();
            setClasses((prev) =>
                prev.map((cls) => (cls._id === classId ? { ...cls, notesLink: updated.notesLink } : cls))
            );
            
            Swal.fire("Success", "Notes link saved successfully", "success");
        } catch (error) {
            console.error("Error updating notes link:", error);
            Swal.fire("Error", "Failed to save notes link", "error");
        }
    };

    const handleRateTeacher = async (teacherId, classId) => {
        const rating = ratings[classId];
        if (!rating || rating < 1 || rating > 5) {
            return Swal.fire("Invalid Rating", "Please provide a rating between 1 and 5", "warning");
        }

        try {
            const res = await fetch(`http://localhost:5000/api/teacher/update-rating/${teacherId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rating, classId }),
            });

            if (res.ok) {
                // Update the class to mark it as rated
                await updateClassRatedStatus(classId);
                Swal.fire("Thank you!", "Your rating has been submitted", "success");
            } else {
                Swal.fire("Error", "Something went wrong while submitting rating", "error");
            }
        } catch (error) {
            console.error("Error rating teacher:", error);
            Swal.fire("Error", "Failed to submit rating", "error");
        }
    };

    const updateClassRatedStatus = async (classId) => {
        try {
            const res = await fetch(`http://localhost:5000/api/classes/update-rated/${classId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rated: true }),
            });
            
            if (res.ok) {
                setClasses((prev) =>
                    prev.map((cls) => (cls._id === classId ? { ...cls, rated: true } : cls))
                );
            }
        } catch (error) {
            console.error("Error updating rated status:", error);
        }
    };

    const handleCancelClass = (classId) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this cancellation!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, cancel it!",
            cancelButtonText: "No, keep it",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await fetch(`http://localhost:5000/api/classes/delete/${classId}`, {
                        method: "DELETE",
                    });

                    if (res.ok) {
                        setClasses((prev) => prev.filter((cls) => cls._id !== classId));
                        Swal.fire("Cancelled!", "Your class has been cancelled.", "success");
                    } else {
                        throw new Error("Delete failed");
                    }
                } catch (error) {
                    console.error("Cancel error:", error);
                    Swal.fire("Error", "Something went wrong while cancelling", "error");
                }
            }
        });
    };

    const handlePayment = async (classId) => {
        try {
            const res = await fetch(`http://localhost:5000/api/classes/update-payment-status/${classId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ paymentStatus: "paid" }),
            });
            
            if (res.ok) {
                const updated = await res.json();
                setClasses((prev) =>
                    prev.map((cls) => (cls._id === classId ? updated : cls))
                );
                Swal.fire("Success", "Payment status updated successfully", "success");
            } else {
                throw new Error("Payment update failed");
            }
        } catch (error) {
            console.error("Payment error:", error);
            Swal.fire("Error", "Failed to update payment status", "error");
        }
    };

    const getFilteredClasses = () => {
        const now = new Date();

        let filtered = classes.map((cls) => {
            const classDate = new Date(cls.classDate);
            const isPast = classDate <= now;
            const isUpcoming = classDate > now;
            const status = isPast && cls.status === "upcoming" ? "incompleted" : cls.status;
            
            return {
                ...cls,
                status,
                isPast,
                isUpcoming,
                classDate,
            };
        });

        if (filter === "upcoming") {
            filtered = filtered.filter((cls) => cls.isUpcoming);
        } else if (filter === "previous") {
            filtered = filtered.filter((cls) => cls.isPast);
        }
        
        // Sort by most recent first
        return filtered.sort((a, b) => b.classDate - a.classDate);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "completed":
                return "success";
            case "cancelled":
                return "danger";
            case "upcoming":
                return "primary";
            case "incompleted":
                return "warning";
            default:
                return "secondary";
        }
    };

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const showNotes = (notes) => {
        setCurrentNotes(notes);
        setShowNotesModal(true);
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
                <Spinner animation="border" variant="primary" />
                <span className="ms-3">Loading classes...</span>
            </div>
        );
    }

    const filteredClasses = getFilteredClasses();

    return (
        <Container className="py-4">
            <Card className="shadow-sm mb-4">
                <Card.Header className="bg-primary text-white">
                    <h4 className="mb-0">My Classes</h4>
                </Card.Header>
                <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <ButtonGroup>
                            <Button 
                                variant={filter === "all" ? "primary" : "outline-primary"} 
                                onClick={() => setFilter("all")}
                            >
                                All Classes
                            </Button>
                            <Button 
                                variant={filter === "upcoming" ? "primary" : "outline-primary"} 
                                onClick={() => setFilter("upcoming")}
                            >
                                Upcoming
                            </Button>
                            <Button 
                                variant={filter === "previous" ? "primary" : "outline-primary"} 
                                onClick={() => setFilter("previous")}
                            >
                                Previous
                            </Button>
                        </ButtonGroup>
                        
                        <div>
                            <Badge bg="primary" className="me-2">Total: {classes.length}</Badge>
                            <Badge bg="success">Upcoming: {classes.filter(c => new Date(c.classDate) > new Date()).length}</Badge>
                        </div>
                    </div>
                    
                    {filteredClasses.length === 0 ? (
                        <div className="text-center py-5">
                            <h5 className="text-muted">No classes found</h5>
                            <p>You don't have any classes scheduled yet.</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <Table striped bordered hover className="align-middle">
                                <thead>
                                    <tr>
                                        <th>Date & Time</th>
                                        <th>Status</th>
                                        <th>Payment</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredClasses.map((cls) => (
                                        <tr key={cls._id}>
                                            <td>
                                                {formatDateTime(cls.classDate)}
                                                <br />
                                                <small className="text-muted">
                                                    {new Date(cls.classDate) > new Date() 
                                                        ? "Upcoming" 
                                                        : "Completed"}
                                                </small>
                                            </td>
                                            
                                            
                                            <td>
                                                <Badge bg={getStatusColor(cls.status)}>
                                                    {cls.status.toUpperCase()}
                                                </Badge>
                                            </td>
                                            <td>
                                                <Badge bg={cls.paymentStatus === "paid" ? "success" : "danger"}>
                                                    {cls.paymentStatus.toUpperCase()}
                                                </Badge>
                                                {cls.transactionId && (
                                                    <small className="d-block text-muted">ID: {cls.transactionId}</small>
                                                )}
                                            </td>
                                            <td>
                                                <div className="d-flex flex-wrap gap-2">
                                                    {cls.notesLink && (
                                                        <Button 
                                                            variant="outline-info" 
                                                            size="sm"
                                                            onClick={() => showNotes(cls.notesLink)}
                                                        >
                                                            <FaEye className="me-1" /> Notes
                                                        </Button>
                                                    )}
                                                    
                                                    {!cls.rated && cls.status === "completed" && (
                                                        <Button 
                                                            variant="outline-warning" 
                                                            size="sm"
                                                            onClick={() => {
                                                                const rating = prompt("Rate your teacher (1-5):");
                                                                if (rating && rating >= 1 && rating <= 5) {
                                                                    handleRateTeacher(cls.teacherId, cls._id);
                                                                    setRatings(prev => ({ ...prev, [cls._id]: rating }));
                                                                }
                                                            }}
                                                        >
                                                            <FaStar className="me-1" /> Rate
                                                        </Button>
                                                    )}
                                                    
                                                    {cls.paymentStatus === "unpaid" && 
                                                     cls.status === "incompleted" && (
                                                        <Button 
                                                            variant="success" 
                                                            size="sm"
                                                            onClick={() => handlePayment(cls._id)}
                                                        >
                                                            <FaMoneyBillWave className="me-1" /> Pay
                                                        </Button>
                                                    )}
                                                    
                                                    {cls.status === "upcoming" && (
                                                        <Button 
                                                            variant="danger" 
                                                            size="sm"
                                                            onClick={() => handleCancelClass(cls._id)}
                                                        >
                                                            <FaTrash className="me-1" /> Cancel
                                                        </Button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    )}
                </Card.Body>
            </Card>
            
            {/* Notes Modal */}
            <Modal show={showNotesModal} onHide={() => setShowNotesModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Class Notes</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {currentNotes ? (
                        <>
                            <p className="mb-3">You can access the class notes using the link below:</p>
                            <a 
                                href={currentNotes} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="d-block mb-3"
                            >
                                {currentNotes}
                            </a>
                            <Button 
                                variant="primary"
                                onClick={() => {
                                    navigator.clipboard.writeText(currentNotes);
                                    Swal.fire("Copied!", "Link copied to clipboard", "success");
                                }}
                            >
                                Copy Link
                            </Button>
                        </>
                    ) : (
                        <p>No notes available for this class.</p>
                    )}
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default StudentClasses;