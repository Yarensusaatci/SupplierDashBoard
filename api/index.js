import express from "express";
import bodyParser from "body-parser";
import mongoose, { connect } from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import ordersModel from "./models/orders.js";
import productsModel from "./models/products.js";
import vendorsModel from "./models/vendors.js";
import { Types } from 'mongoose';



const app = express();
dotenv.config();
app.use(cors());
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    app.listen(PORT, () => {
        console.log('Server is running on port ');
    });
}).catch((error) => {
    console.error(error.message);
});


app.get("/getVendors", async(req, res) => {
    try {
        const data = await vendorsModel.find();
        res.send({ status: "ok", data: data });
    } catch (error) {
        console.log(error);
    }
});

app.get("/getOrders", async(req, res) => {
    try {
        const data = await ordersModel.find();
        res.send({ status: "ok", data: data });

    } catch (error) {
        console.log(error);
    }
});


app.get("/getProducts", async(req, res) => {
    try {
        const data = await productsModel.find();
        res.send({ status: "ok", data: data });

    } catch (error) {
        console.log(error);
    }
});

  
//monthly analysis için select year
app.get("/getPaymentYears", async (req, res) => {
    try {
      const result = await ordersModel.aggregate([
        {
          $group: {
            _id: { $year: "$payment_at" },
          },
        },
        {
          $project: {
            year: "$_id",
            _id: 0,
          },
        },
        {
          $sort: { year: 1 } // Yılları artan sırayla sırala
        }
      ]);
  
      const paymentYears = result.map((entry) => entry.year);
  
      res.send({ status: "ok", data: paymentYears });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Veritabanı hatası" });
    }
  });
  
  
  
  
  
  


app.get("/getVendors", async(req, res) => {
    try {
        const data = await vendorsModel.find();
        res.send({ status: "ok", data: data });
    } catch (error) {
        console.log(error);
    }
});


//monthly analysis
app.get("/selectMonthly/:year/:vendor", async (req, res) => {
    try {
        const selectedYear = parseInt(req.params.year);
        const selectedVendor = req.params.vendor;
    
        // Tüm siparişleri alın
        const allOrders = await ordersModel.find();

        // Seçilen yıl ve satıcıya göre filtreleme işlemi
        const filteredOrders = allOrders.filter(order => {
            const paymentDate = new Date(order.payment_at);
            const year = paymentDate.getFullYear();
            const vendor = order.vendor_name; // Bu kısmı sipariş nesnesinin yapısına göre güncelleyin
        
            return year === selectedYear && vendor === selectedVendor;
        });
        
        // Filtrelenmiş siparişleri tarih bilgisine göre sıralayın
        filteredOrders.sort((a, b) => {
            const dateA = new Date(a.payment_at);
            const dateB = new Date(b.payment_at);
            return dateA - dateB;
        });
        // Tüm ayları içeren bir nesne oluşturun ve varsayılan olarak item_count'u 0 yapın
        const ordersByMonthAndYear = {};
        for (let month = 1; month <= 12; month++) {
            ordersByMonthAndYear[month] = {
                month: month,
                item_count: 0
            };
        }
    
        for (const order of allOrders) {
            const paymentDate = new Date(order.payment_at);
            const month = paymentDate.getMonth() + 1; // Ayı alın (Ocak = 1, Şubat = 2, vb.)
            const year = paymentDate.getFullYear(); // Yılı alın
    
            // Seçilen yıl ve vendor ile eşleşiyorsa işlem yap
            if (year === selectedYear) {
                const cart_items = await ordersModel.find({
                    "cart_item.product": { $ne: null },
                    "payment_at": { $gte: new Date(selectedYear, 0, 1), $lt: new Date(selectedYear + 1, 0, 1) }
                });
    
                // cart_items bir nesne olarak geliyorsa, diziye dönüştürün
                console.log("cart itemmmmm:", cart_items);
                for (const item of cart_items) {
                    const cardItem = item._doc.cart_item;
                    cardItem.forEach(async (obj) => {
                        const product = await productsModel.findById(obj.product);
    
                        if (!product) {
                            console.log("Ürün bulunamadı:", obj.product);
                            return;
                        }
    
                        const vendor = product ? await vendorsModel.findById(product.vendor) : null;     
    
                        if (vendor && vendor.name === selectedVendor) {
                            const propertyCount = (Object.keys(cardItem).length);
    
                            ordersByMonthAndYear[month].item_count += (obj.item_count) * (obj.quantity) * propertyCount;
                        }
                    });
                }
            }
        }
    
        // Sadece "month" ve "item_count" içeren bir dizi oluşturun
        const result = Object.values(ordersByMonthAndYear).map(item => ({
            month: item.month,
            item_count: item.item_count
        }));
    
        res.send({ status: "ok", data: result });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Veritabanı hatası" });
    }
});


app.get("/getOrdersByMonthAndYear/:year/:vendor", async (req, res) => {
    try {
      const selectedYear = parseInt(req.params.year);
      const selectedVendor = req.params.vendor;
    
    
      const cart_items = await ordersModel.distinct("cart_item", { "cart_item.product": { $ne: null } });
      //let cart_items = [];

  // Tüm siparişleri alın
      // Tüm siparişleri alın
      const allOrders = await ordersModel.find();
  
      // Siparişleri tarih bilgisine göre sıralayın
      allOrders.sort((a, b) => {
        const dateA = new Date(a.payment_at);
        const dateB = new Date(b.payment_at);
        return dateA - dateB;
      });
  
      // Siparişleri aylara, seçilen yıla ve seçilen vendor'a göre gruplayın
      const ordersByMonthAndYear = {};
  
      for (const order of allOrders) {
        const paymentDate = new Date(order.payment_at);
        const month = paymentDate.getMonth() + 1; // Ayı alın (Ocak = 1, Şubat = 2, vb.)
        const year = paymentDate.getFullYear(); // Yılı alın
  
        // Seçilen yıl ve vendor ile eşleşiyorsa işlem yap
        if (year === selectedYear) {
          //  console.log("or",order[0]);
          const cart_items = await ordersModel.find({
            "cart_item.product": { $ne: null },
            "payment_at": { $gte: new Date(selectedYear, 0, 1), $lt: new Date(selectedYear + 1, 0, 1) }
        });
  
          // cart_items bir nesne olarak geliyorsa, diziye dönüştürün
       /*   if (!Array.isArray(cart_items)) {
            cart_items = [cart_items];
          }
  */
          console.log("cart itemmmmm:", cart_items);
          for (const item of cart_items) {
            const keys = Object.keys(item);
          console.log("_doc olan"  ,item._doc.cart_item);



          const cardItem = item._doc.cart_item;
          cardItem.forEach(async (obj) => {
         
              const product = await productsModel.findById(obj.product);
          
              if (!product) {
                console.log("Ürün bulunamadı:", obj.product);
                return;
              }
          
              // Diğer işlemleri burada yapabilirsiniz.
              console.log("OBJJJJ:", obj);
              console.log("PRODUCT:", product);
     

const vendor = product ? await vendorsModel.findById(product.vendor) : null;     
  
if (vendor && vendor.name === selectedVendor) {
    if (!ordersByMonthAndYear[month]) {
      ordersByMonthAndYear[month] = {
        month: month,
        total_item_count: 0, // Toplam item_count için başlangıç değeri
        orders: []
      };
    }
    const propertyCount = (Object.keys(cardItem).length);
 
    ordersByMonthAndYear[month].orders.push({
      ...order.toObject(),
      vendor_name: vendor.name,
      item_count: (obj.item_count)*(obj.quantity)*propertyCount
    });
    ordersByMonthAndYear[month].total_item_count += obj.item_count; // item_count'ları topla
    ordersByMonthAndYear[month].total_item_count += obj.quantity; // item_count'ları topla

      
  }
});

          }
        }
      }
  
      // Object.values ile ordersByMonthAndYear'daki nesneleri bir diziye dönüştür
      const monthlyOrdersArray = Object.values(ordersByMonthAndYear);
  
      res.send({ status: "ok", data: monthlyOrdersArray });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Veritabanı hatası" });
    }
  });


  //genel analiz için
//bu
app.get("/getProductSalesForVendor/:vendor", async(req, res) => {
    try {
        const selectedVendor = req.params.vendor;
        const cart_items = await ordersModel.distinct("cart_item", { "cart_item.product": { $ne: null } });

        // Eğer cart_item içinde hiç null olmayan değer yoksa, boş bir array dönecektir
        if (!cart_items || cart_items.length === 0) {
            res.status(404).json({ error: 'Ürünlere ait sipariş bulunamadı' });
            return;
        }

        // Ürün adlarını, tedarikçi isimlerini ve total değerlerini eklemek için bir döngü kullanalım
        const productsData = {};

        for (const cart_item of cart_items) {
            const product = await productsModel.findById(cart_item.product);
            const vendor = product ? await vendorsModel.findById(product.vendor) : null;

            if (product && vendor && vendor.name === selectedVendor) {
                const quantity = cart_item.quantity;
                const item_count = cart_item.item_count;
                const total_sales_count = quantity * item_count;
                //toplam kazanç için price-cogs yapıp total product ile çarptım
                const price = cart_item.price;
                const cogs = cart_item.cogs;
                const earningFromProduct = (price - cogs);
                const total_earning = earningFromProduct * total_sales_count;
                // Ürünün daha önce eklenip eklenmediğini kontrol et
                if (!productsData[product.name]) {
                    productsData[product.name] = {
                        product_name: product.name,
                        vendor_name: vendor.name,
                        total_sales_count: 0,
                        total_earning: 0
                    };
                }

                // Ürünün toplam satışlarını güncelle
                productsData[product.name].total_sales_count += total_sales_count;
                productsData[product.name].total_earning += total_earning;
            }
        }

        // Object.values ile productsData'daki nesneleri bir diziye dönüştür
        const cart_item_with_details = Object.values(productsData);

        res.send({ status: "ok", data: cart_item_with_details });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Veritabanı hatası" });
    }
});


///bu
app.get("/getCardItem", async(req, res) => {
    try {
        const cart_item = await ordersModel.distinct("cart_item", { "cart_item.product": { $ne: null } });

        // Eğer cart_item içinde hiç null olmayan değer yoksa, boş bir array dönecektir
        if (!cart_item || cart_item.length === 0) {
            res.status(404).json({ error: 'Ürünlere ait sipariş bulunamadı' });
            return;
        }

        res.send({ status: "ok", data: cart_item });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Veritabanı hatası" });
    }
});
