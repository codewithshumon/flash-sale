import { NextResponse } from "next/server";
import Product from "../../models/Product";
import dbConnect from "../../lib/dbConnect";

// GET /api/fetch-products - Fetch all products
// GET /api/fetch-products?flashSale=true - Fetch only flash sale products
// GET /api/fetch-products?favorites=true - Fetch only favorite products
export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const flashSale = searchParams.get("flashSale");
    const favorites = searchParams.get("favorites");
    const limit = searchParams.get("limit");
    const sort = searchParams.get("sort"); // 'price-asc', 'price-desc', 'newest'

    let query = {};
    let sortOptions = {};

    // Filter for flash sale products (where flashSaleEnd is in the future)
    if (flashSale === "true") {
      query.flashSaleEnd = { $gt: new Date() };
    }

    // Filter for favorite products
    if (favorites === "true") {
      query.isFavorite = true;
    }

    // Sorting options
    if (sort === "price-asc") {
      sortOptions = { offerPrice: 1 };
    } else if (sort === "price-desc") {
      sortOptions = { offerPrice: -1 };
    } else if (sort === "newest") {
      sortOptions = { createdAt: -1 };
    }

    // Build the query
    let productsQuery = Product.find(query);

    // Apply sorting
    if (Object.keys(sortOptions).length > 0) {
      productsQuery = productsQuery.sort(sortOptions);
    }

    // Apply limit if specified
    if (limit) {
      productsQuery = productsQuery.limit(parseInt(limit));
    }

    // Execute the query
    const products = await productsQuery.exec();

    // Transform the data to include time remaining for flash sales
    const transformedProducts = products.map((product) => {
      const productObj = product.toObject();

      // Add time remaining if it's a flash sale product
      if (product.flashSaleEnd > new Date()) {
        const timeRemaining = product.flashSaleEnd - new Date();
        productObj.timeRemaining = timeRemaining;
      }

      return productObj;
    });

    return NextResponse.json(
      { success: true, data: transformedProducts },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
