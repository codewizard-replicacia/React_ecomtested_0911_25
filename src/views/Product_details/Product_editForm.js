
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  BASE_URL,
  PATH_ORDER,
  PATH_INVOICE,
  PATH_CUSTOMER,
  PATH_PRODUCTTYPE,
  PATH_SHIPMENT,
  PATH_PRODUCT,
  PATH_PRODUCTPRICE,
  PATH_SHIPMENTITEM,
  PATH_DOCUMENT,
  PATH_CUSTOMERPAYMENTMETHOD,
  PATH_PAYMENT,
  PATH_OTHERDETAILS,
  PATH_ORDERITEM,
  PATH_PRODUCTONBOARDING,
  } from '../../utils/constants';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  Grid,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from '@material-ui/core';

import { productViewConfig } from '../../utils/display_configuration';
import makeApiCall from '../../utils/makeApiCall';
import MuiSelect from '../../components/select/select_index';
import MuiDatePicker from '../../components/date-picker/date-picker'
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
  table: {
    margin: '0 auto',
    width: '90%',
  },
  titleCell: {
    width: '35%',
    textAlign: 'right',
    borderBottom: 'none',
  },
  valueCell: {
    textAlign: 'left',
    borderBottom: 'none',
  },
  link: {
    color: theme.palette.secondary.main,
    textDecoration: 'underline',
    cursor: 'pointer',
  },
}));

const EditProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const snackbar = useSnackbar();
  const styles = useStyles();
    const [formData, setFormData] = useState({});
          const [errorData, setErrorData] = useState({});

  


  const [productPrices, setProductPrices] = useState([]);

  useEffect(() => {
    const fetchProductPrices = async () => {
      const typesResponse = await makeApiCall(
        `${BASE_URL}${PATH_PRODUCTPRICE}`
      );
      const jsonResp = await typesResponse.json();
      setProductPrices(jsonResp.value);
    };
    fetchProductPrices();
  }, []);

  useEffect(() => {
    const fetchProductById = async () => {
      const productResponse = await makeApiCall(
        `${BASE_URL}${PATH_PRODUCT}(${id})`
      );
      const jsonResp = await productResponse.json();
      setFormData(jsonResp);
    };
    fetchProductById();
  }, [id]);

  const handleChange = (key, value) => {
    setFormData({ ...formData, ...{ [key]: value } });
  };

  

  const submitForm = async () => {
      
    const { 
            Product_id,
    ...otherData } = formData;

    

    

    const resp = await makeApiCall(
      `${BASE_URL}${PATH_PRODUCT}(${formData.Product_id})`,
      'PATCH',
            JSON.stringify({
        ...otherData,
            Product_id: parseInt(Product_id),
      })
    );
    if (resp.ok) {
      snackbar.enqueueSnackbar('Successfully updated Product', {
        variant: 'success',
      });
      navigate({ pathname: '/products' });
    } else {
      const jsonData = await resp.json();
      snackbar.enqueueSnackbar(`Failed! - ${jsonData.message}`, {
        variant: 'error',
      });
    }
  };

  return (
    <Box padding={2}>
      <Grid>
        <Grid item lg={12} xs={12}>
          <Box display="flex" justifyContent="space-between">
            <Typography className="page-heading" variant="h5">
              Edit Product
            </Typography>
            <div className="action-buttons">
              <Button
                size="small"
                variant="contained"
                color="primary"
                className="margin-right"
                onClick={submitForm}
              >
                Save
              </Button>
              &nbsp;
              <Button
                size="small"
                variant="contained"
                color="secondary"
                onClick={() => navigate({ pathname: '/products' })}
              >
                Cancel
              </Button>
            </div>
          </Box>
        </Grid>
        <Divider />
        <Box marginTop={2} className="form-container">
          <Grid container item lg={12} xs={12}>
            {Object.keys(productViewConfig)?.map((config, ind) => (
              <>
                <Grid item lg={5} md={5} xs={12}>
                  <Box marginTop={1}>
                    <Typography variant="h6">{config}</Typography>
                    <Table size="small" className={styles.table}>
                      <TableBody>
                        {productViewConfig[config]?.map(
                          ({ key, value, type, required }) => (
                            <TableRow
                              key={key}
                              className="responsive-table-row"
                            >
                              <TableCell
                                className={[styles.titleCell, 'row-label'].join(
                                  ' '
                                )}
                              >
                                <Typography variant="body1">
                                  {value}
                                  {required ? '*' : ''}:
                                </Typography>
                              </TableCell>
                              <TableCell
                                className={[styles.valueCell, 'row-value'].join(
                                  ' '
                                )}
                              >
                                {key === 'Product_id' ? (
                                  <Typography variant="body1">
                                    {formData[key]}
                                  </Typography>
                                ) : 
                                  key === 'ProductProductPrice' ? (
                                    <MuiSelect
                                      value={
                                        formData[key]
                                          ? productPrices.find(
                                              (e) =>
                                                e.PpId ===
                                                formData[key]
                                            )
                                          : ''
                                      }
                                      options={productPrices}
                                      error={errorData[key]}
                                      helperText={errorData[key]}
                                      valueKey="Price"
                                      handleChange={(e) =>
                                        handleChange(
                                          key,
                                          e.target.value.PpId
                                        )
                                      }
                                    />
                                  ) : 
                                type === 'date' ? (
                                  <MuiDatePicker
                                      name="Date Picker"
                                      value={formData[key] ? moment.utc(formData[key]).format("YYYY-MM-DDTHH:mm:ss") : ''}
                                      handleChange={(e) => {
                                        handleChange(key, moment.utc(e.target.value).format(
                                          "YYYY-MM-DDTHH:mm:ss[Z]"
                                        ))
                                      }}
                                      error={errorData}
                                    />
                                ) : type === 'boolean' ? (
                                  <Checkbox
                                    checked={formData[key] || false}
                                    onChange={(e) =>
                                      handleChange(key, e.target.checked)
                                    }
                                  />
                                ) :  (
                                  <>
                                    <TextField
                                      name={key}
                                      fullWidth
                                      className="text-field-custom"
                                      variant="outlined"
                                      size="small"
                                      type={type}
                                      error={errorData[key]}
                                      helperText={errorData[key]}
                                      value={formData[key] || ''}
                                      onChange={(e) => {
                                        if (e.target.reportValidity()) {
                                          handleChange(key, e.target.value);
                                        }
                                      }}
                                    />
                                  </>
                                )}
                              </TableCell>
                            </TableRow>
                          )
                        )}
                      </TableBody>
                    </Table>
                  </Box>
                </Grid>
                <Grid item lg={1} md={1} xs={false} />
              </>
            ))}
          </Grid>
        </Box>
      </Grid>
    </Box>
  );
};

export default EditProductForm;
