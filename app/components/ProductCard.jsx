import Image from "next/image";
import HeartIcon from "./HeartIcon";

const ProductCard = ({ products }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
      {products.map((product) => (
        <div
          key={product._id}
          className=" h-[460px] border-[1px] border-[#e4dddd] rounded-lg  shadow-sm hover:shadow-md transition-shadow "
        >
          <div className="relative w-full flex justify-center bg-[#ffffff]   ">
            {product.image && (
              <Image
                src={product.image}
                alt={product.title}
                width={240}
                height={240}
                className=" object-contain "
                priority={true}
              />
            )}
            <div className="absolute top-4 right-2 bg-white p-2 text-xs font-bold rounded-full shadow-[0_0_15px_0_rgba(0,0,0,0.1)]">
              <HeartIcon className="w-4 h-4 text-gray-600" />
            </div>
          </div>
          <div className="p-4">
            <h3 className=" text-[1rem] font-semibold ">{product.title}</h3>
            {product.timeRemaining ? (
              <div className="flex gap-2  items-end ">
                <span className="font-bold text-[#000000] text-[1.7rem]  ">
                  ${product.offerPrice}
                </span>
                <span className="text-[#616161] text-[0.8rem]   line-through pb-2">
                  ${product.regularPrice}
                </span>
              </div>
            ) : (
              <div className="">
                <span className="font-bold text-[#000000] text-[1.7rem]  ">
                  ${product.regularPrice}
                </span>
              </div>
            )}
          </div>
          {product.countdown && (
            <div className=" relative w-full mt-5">
              <div className=" relative w-full flex left-[-5] justify-around items-center pl-5 py-1 bg-[#0053E2] ">
                <div className="absolute left-0 top-[-15%] w-[5px] h-[5px] overflow-hidden">
                  <div className="w-full h-full [clip-path:polygon(100%_0,0%_100%,100%_100%)] bg-[#0B2A6E]"></div>
                </div>
                <p className="text-[0.75rem] text-[#ffffff]">
                  ONLY{" "}
                  <span className=" font-bold"> {product.itemsLeft} ITEM</span>{" "}
                  LEFT
                </p>
                <div className="flex text-[0.65rem] gap-2 flex-row py-1 px-2 rounded-[5px] items-center bg-[#FF9500] text-[#ece2e2]">
                  <div className="   text-center">
                    <span className="font-bold block bg-[#000000] px-1">
                      {String(product.countdown.hours).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="    text-center">
                    <span className="font-bold block  bg-[#000000] px-1">
                      {String(product.countdown.minutes).padStart(2, "0")}
                    </span>
                  </div>
                  <div className=" text-center ">
                    <span className="font-bold block  bg-[#000000] px-1">
                      {String(product.countdown.seconds).padStart(2, "0")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProductCard;
