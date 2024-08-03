import { useState, useEffect, Fragment } from "react";
import { useInView } from "react-intersection-observer";
import axios from "axios";
import {
    useInfiniteQuery,
} from "@tanstack/react-query";
import { Loading } from "@/components/dashboard/loading";
import { SearchBar } from "@/components/dashboard/search-bar";
import { Separator } from "@/components/ui/separator";

const MatriksKeputusanPage = () => {
    // const { role } = useAuth();
    const { ref, inView } = useInView();
    const [searchValue, setSearchValue] = useState("");
    const {
        status,
        data,
        error,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
    } = useInfiniteQuery({
        queryKey: ["get-all-matriks-keputusan"],
        queryFn: ({ pageParam }) => fetchAllMatriksKeputusan(pageParam),
        initialPageParam: 1,
        getNextPageParam: (lastPage, lastPageParam) =>
            lastPage.length === 0 ||
                lastPage.totalPages === lastPageParam.length ||
                lastPage.content.length === 0
                ? undefined
                : lastPageParam.length + 1,
    });

    async function fetchAllMatriksKeputusan(pageParam) {
        // if (role !== "ADMIN") return [];
        const response = await axios.get("http://localhost:8082/sales/matrikskeputusan?page=1&limit=17", {
            params: {
                page: pageParam,
            },
        });

        if (response.status === 200) {
            return response.data;
        }
    }

    useEffect(() => {
        if (inView) {
            fetchNextPage();
        }
    }, [fetchNextPage, inView]);

    // close modal ↓↓↓
    function onClose() {
        setOpen(false);
    }

    // onSubmit event ↓↓↓
    function onSearch(e) {
        e.preventDefault();

        // TODO: Handle on search
        alert(searchValue);
    }

    if (error) {
        return (
            <div className="w-full h-full flex justify-center items-center">
                <h1 className="text-xl font-semibold">Error!</h1>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col">
            <div className="w-full flex justify-end items-center gap-x-2 p-2">
                <SearchBar
                    onSubmit={onSearch}
                    placeholder="Cari Matriks"
                    onChange={(e) => setSearchValue(e.target.value)}
                />
            </div>
            {status === "pending" ? (
                <Loading />
            ) : (
                <div className="w-full h-full overflow-y-auto space-y-2 pb-20">
                    {data.pages.map((group, i) => (
                        <MatriksKeputusanList key={i} data={group.content} />
                    ))}

                    {hasNextPage && (
                        <div ref={ref}>{isFetchingNextPage ? <Loading /> : null}</div>
                    )}
                </div>
            )}
        </div>
    );
};

const MatriksKeputusanList = ({ data }) => {
    return (
        <>
            {data.length < 1 ? (
                <div className="w-full h-full flex justify-center items-center">
                    <h1 className="text-lg font-semibold">Matriks Keputusan Kosong</h1>
                </div>
            ) : (
                <Fragment>
                    {data?.map((elem) => (
                        <MatriksKeputusanCard key={elem.idsales} data={elem} />
                    ))}
                </Fragment>
            )}
        </>
    );
};

const MatriksKeputusanCard = ({ data }) => {
    return (
        <div className="w-full flex justify-between items-center border shadow-md rounded-md p-2">
            <div className="space-y-1 truncate">
                    {data.nama}
                <div className="flex gap-x-2 h-[20px]">
                    <h1 className="text-sm font-medium text-neutral-600">
                        Tahun: {data.tahun}
                    </h1>
                    <Separator orientation="vertical" />
                    <h1 className="text-sm font-medium text-neutral-600">
                        Achivement Total: {data.achievtotal}
                    </h1>
                    <Separator orientation="vertical" />
                    <h1 className="text-sm font-medium text-neutral-600">
                        Achivement Gadus: {data.achievgadus}
                    </h1>
                    <Separator orientation="vertical" />
                    <h1 className="text-sm font-medium text-neutral-600">
                        Achivement Premium: {data.achievpremium}
                    </h1>
                    <Separator orientation="vertical" />
                    <h1 className="text-sm font-medium text-neutral-600">
                        Jumlah Customer: {data.jumcustomer}
                    </h1>
                    <Separator orientation="vertical" />
                    <h1 className="text-sm font-medium text-neutral-600">
                        Jumlah Visit: {data.jumvisit}
                    </h1>
                </div>
            </div>
        </div>
    );
};

export default MatriksKeputusanPage;
