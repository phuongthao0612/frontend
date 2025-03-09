import React, { useState, useEffect } from "react";
import { Table, Button, Container, Form, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import * as clothingService from "../services/ClothingService";
import { toast } from "react-toastify";

const ClothingList = () => {
    const [clothings, setClothings] = useState([]);
    const [types, setTypes] = useState([]);
    const [searchName, setSearchName] = useState("");
    const [searchType, setSearchType] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedClothing, setSelectedClothing] = useState(null);

    useEffect(() => {
        const fetchTypes = async () => {
            const typeData = await clothingService.getAllTypes();
            setTypes(typeData);
        };
        fetchTypes();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const params = { name: searchName, type: searchType };
            const clothingData = await clothingService.getAllClothings(params);
            setClothings(clothingData);
        };
        fetchData();
    }, [searchName, searchType]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        if (isNaN(date)) return "";
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const handleDeleteClick = (clothing) => {
        setSelectedClothing(clothing);
        setShowModal(true);
    };

    const confirmDelete = async () => {
        try {
            await clothingService.deleteClothing(selectedClothing.id);
            setClothings(clothings.filter((item) => item.id !== selectedClothing.id));
            toast.success("Xóa sản phẩm thành công!");
        } catch (error) {
            toast.error("Có lỗi xảy ra khi xóa sản phẩm!");
        } finally {
            setShowModal(false);
            setSelectedClothing(null);
        }
    };

    const handleModalClose = () => {
        setShowModal(false);
        setSelectedClothing(null);
    };

    return (
        <Container className="mt-4">
            <h2 className="text-center mb-4">Danh Sách Sản Phẩm</h2>
            <div className="mb-3">
                <Link to="/clothings/create">
                    <Button variant="primary">Thêm Mới</Button>
                </Link>
            </div>
            <Form className="d-flex mb-3">
                <Form.Control
                    type="text"
                    placeholder="Tìm theo tên sản phẩm..."
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    className="me-2"
                />
                <Form.Select
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                >
                    <option value="">Tất cả loại</option>
                    {types.map((type) => (
                        <option key={type.id} value={type.name}>
                            {type.name}
                        </option>
                    ))}
                </Form.Select>
            </Form>

            <Table striped bordered hover>
                <thead className="table-dark">
                <tr>
                    <th>Mã Sản Phẩm</th>
                    <th>Tên Sản Phẩm</th>
                    <th>Ngày Nhập</th>
                    <th>Số Lượng</th>
                    <th>Loại Sản Phẩm</th>
                    <th>Chức Năng</th>
                </tr>
                </thead>
                <tbody>
                {clothings.length > 0 ? (
                    clothings.map((item) => (
                        <tr key={item.id}>
                            <td>{item.code}</td>
                            <td>{item.name}</td>
                            <td>{formatDate(item.date)}</td>
                            <td>{item.quantity}</td>
                            <td>{item.type?.name || "Không có loại"}</td>
                            <td>
                                <Link to={`/clothings/edit/${item.id}`}>
                                    <Button variant="warning" className="me-2">
                                        Cập nhật
                                    </Button>
                                </Link>
                                <Button variant="danger" onClick={() => handleDeleteClick(item)}>
                                    Xóa
                                </Button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="6" className="text-center">
                            Không có dữ liệu
                        </td>
                    </tr>
                )}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận xóa</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Bạn có chắc chắn muốn xóa sản phẩm{" "}
                    <strong>{selectedClothing?.name}</strong> không?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalClose}>
                        Hủy bỏ
                    </Button>
                    <Button variant="danger" onClick={confirmDelete}>
                        Xóa
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default ClothingList;
