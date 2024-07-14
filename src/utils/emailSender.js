import emailjs from 'emailjs-com';

const SERVICE_ID = "service_9hs17b8";
const PUBLIC_KEY = "ZxyKTZuAZthxkxK4a";
const TEMPLATE_ID_1 = "template_07ljdgh";
const TEMPLATE_ID_2 = "template_zcss1v5";

export const notifiySuccessfullOrder = (userInfo, selectedProducts, endDate, startDate) => {

    const selectedProductsText = selectedProducts.map(product => "- " + product.productName + " x " + product.selectedQuantity + "\n");

    const end_date = (new Date(endDate)).toLocaleDateString('en-GB');
    const start_date = (new Date(startDate)).toLocaleDateString('en-GB')

    const message = {
      from_name: "מחסן חיובי",
      to_name: userInfo.name,
      to_email: userInfo.email,
      message: 'ההזמנה שלכם התקבלה בהצלחה\n המוצרים שלכם: \n' + selectedProductsText.join('\n') + '\n' + 'תאריך התחלת הזמנה: ' + end_date+ '\n' + 'תאריך החזרת המוצרים: ' + start_date  + '\n' 
    }

    emailjs.send(SERVICE_ID, TEMPLATE_ID_1, message, PUBLIC_KEY)
    .then((result) => {
      ;
    }, (error) => {
      console.log('Error:', error.text);
    });
}

export const notifiyLateOrder = (userInfo, selectedProducts) => {
    

    const selectedProductsText = selectedProducts.map(product => "- " + product.productName + " x " + product.selectedQuantity + "\n");

    const message = {
      from_name: "מחסן חיובי",
      to_name: userInfo.name,
      to_email: userInfo.email,
      days_since_return_date: userInfo.days_since_return_date,
      message: 'המוצרים שהשאלתם: \n' + selectedProductsText.join('\n')
    }

    emailjs.send(SERVICE_ID, TEMPLATE_ID_2, message, PUBLIC_KEY)
    .then((result) => {
      ;
    }, (error) => {
      console.log('Error:', error.text);
    });
}