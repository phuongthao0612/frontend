import React, { useState, useEffect } from "react";
import { Formik, Form as FormikForm, Field, ErrorMessage } from "formik";
import { Form, Button, Container } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import * as clothingService from "../services/ClothingService";
import * as Yup from "yup";
import { toast } from "react-toastify";

const ClothingEdit = () => {
    const { id } = useParams();
    const [initialValues, setInitialValues] = useState(null);
    const [types, setTypes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const clothingData = await clothingService.getClothingById(id);
                const dateValue = clothingData.date
                    ? new Date(clothingData.date).toISOString().split("T")[0]
                    : "";
                setInitialValues({
                    code: clothingData.code,
                    name: clothingData.name,
                    quantity: clothingData.quantity,
                    date: dateValue,
                    typeId: clothingData.type ? clothingData.type.id : "",
                });
            } catch (error) {
                toast.error("Lỗi khi tải dữ liệu sản phẩm!");
            }
        };

        const fetchTypes = async () => {
            try {
                const typeData = await clothingService.getAllTypes();
                setTypes(typeData);
            } catch (error) {
                toast.error("Lỗi khi tải danh sách loại sản phẩm!");
            }
        };

        fetchData();
        fetchTypes();
    }, [id]);

    const validationSchema = Yup.object({
        code: Yup.string().required("Bắt buộc nhập mã sản phẩm"),
        name: Yup.string()
            .required("Bắt buộc nhập tên sản phẩm")
            .max(100, "Tên không được quá 100 ký tự"),
        quantity: Yup.number()
            .min(0, "Số lượng không được âm")
            .integer("Số lượng phải là số nguyên")
            .required("Bắt buộc nhập số lượng"),
        date: Yup.date()
            .required("Bắt buộc nhập ngày")
            .max(new Date(), "Ngày không được lớn hơn ngày hiện tại"),
        typeId: Yup.string().required("Chọn loại sản phẩm"),
    });

    const onSubmit = async (values, { setSubmitting }) => {
        try {
            if (
                values.code === initialValues.code &&
                values.name === initialValues.name &&
                values.quantity === initialValues.quantity &&
                values.date === initialValues.date &&
                values.typeId === initialValues.typeId
            ) {
                toast.info("Không có sự thay đổi nào để cập nhật.");
                setSubmitting(false);
                return;
            }

            const clothingData = {
                code: values.code,
                name: values.name,
                quantity: values.quantity,
                date: values.date,
                type: { id: values.typeId },
            };

            await clothingService.updateClothing(id, clothingData);
            toast.success("Cập nhật sản phẩm thành công!");
            navigate("/clothings");
        } catch (error) {
            toast.error("Có lỗi xảy ra khi cập nhật sản phẩm!");
        } finally {
            setSubmitting(false);
        }
    };

    if (!initialValues) return <div>Loading...</div>;

    return (
        <Container>
            <h2 className="text-center mb-4">Cập Nhật Sản Phẩm</h2>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
                enableReinitialize={true}
            >
                {(formik) => (
                    <FormikForm>
                        <Form.Group className="mb-3">
                            <Form.Label>Mã Sản Phẩm</Form.Label>
                            <Field
                                name="code"
                                as={Form.Control}
                                type="text"
                                placeholder="Nhập mã sản phẩm"
                            />
                            <div className="text-danger">
                                <ErrorMessage name="code" />
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Tên Sản Phẩm</Form.Label>
                            <Field
                                name="name"
                                as={Form.Control}
                                type="text"
                                placeholder="Nhập tên sản phẩm"
                            />
                            <div className="text-danger">
                                <ErrorMessage name="name" />
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Số Lượng</Form.Label>
                            <Field
                                name="quantity"
                                as={Form.Control}
                                type="number"
                                placeholder="Nhập số lượng"
                            />
                            <div className="text-danger">
                                <ErrorMessage name="quantity" />
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Ngày Nhập</Form.Label>
                            <Field name="date" as={Form.Control} type="date" />
                            <div className="text-danger">
                                <ErrorMessage name="date" />
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Loại Sản Phẩm</Form.Label>
                            <Field name="typeId" as={Form.Select}>
                                <option value="">Chọn loại sản phẩm</option>
                                {types.map((type) => (
                                    <option key={type.id} value={type.id}>
                                        {type.name}
                                    </option>
                                ))}
                            </Field>
                            <div className="text-danger">
                                <ErrorMessage name="typeId" />
                            </div>
                        </Form.Group>

                        <Button
                            variant="primary"
                            type="submit"
                            disabled={!formik.isValid || formik.isSubmitting}
                        >
                            Cập nhật
                        </Button>
                    </FormikForm>
                )}
            </Formik>
        </Container>
    );
};

export default ClothingEdit;
