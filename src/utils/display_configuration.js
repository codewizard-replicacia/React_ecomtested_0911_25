export const productViewConfig = {
Details: [
    {
      key: "Product_id",
      value: "Product_id",
      type: "text",
      editable: false,
      required: true
    },
    {
      key: "Name",
      value: "Name",
      type: "text",
      editable: false,
      required: true
    },
    {
      key: "Color",
      value: "Color",
      type: "text",
      editable: false,
      required: true
    },
    {
      key: "Manufacturer",
      value: "Manufacturer",
      type: "text",
      editable: false,
      required: true
    },
    {
      key: "Product_description",
      value: "Product_description",
      type: "text",
      editable: false,
      required: true
    },
  ],
Type: [
    {
      key: "ProductProductPrice",
      value: "ProductPrice",
      type: "lookup",
      editable: true,
      required: true
    },
  ],
}
