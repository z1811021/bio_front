import { useState, useEffect } from "react";
import {
    View,
    Text,
    Button,
    Picker,
    ScrollView,
    Image,
} from "@tarojs/components";
import { axios } from "taro-axios";
import Taro from "@tarojs/taro";
import { AtList, AtListItem, AtInput, AtMessage, AtForm } from "taro-ui";
import { apiDomain } from "../../../config/buildConfig";
import "./index.scss";

export default function Index() {
    const [dateSel, setDateSel] = useState("");
    const [dateSelEnd, setDateSelEnd] = useState("");
    const [value, setVal] = useState("");
    const [data, setData] = useState([]);
    const [token, setToken] = useState("");
    const [pageIndex, setPageIndex] = useState(1);
    useEffect(() => {
        Taro.getBackgroundFetchToken({
            success: (res) => {
                console.log(
                    "🚀 ~ file: index.jsx ~ line 19 ~ useEffect ~ res",
                    res
                );
                if (res?.token) {
                    setToken(res?.token);
                } else {
                    Taro.atMessage({
                        message: "请重新登录",
                        type: "warning",
                    });
                    Taro.reLaunch({
                        url: "/pages/index/index",
                    });
                }
            },
            fail: (res) => {
                Taro.atMessage({
                    message: "请重新登录",
                    type: "warning",
                });
                Taro.reLaunch({
                    url: "/pages/index/index",
                });
            },
        });
    }, []);
    function onDateChange(val) {
        console.log("🚀 ~ file: index.jsx ~ line 10 ~ onDateChange ~ val", val);
        setDateSel(val.detail.value);
    }
    function handleChangeVal(val) {
        setVal(val);
    }
    function onDateChangeEnd(val) {
        console.log("🚀 ~ file: index.jsx ~ line 10 ~ onDateChange ~ val", val);
        setDateSelEnd(val.detail.value);
    }
    function imgClick(imgs, img) {
        console.log("🚀 ~ file: index.jsx ~ line 66 ~ imgClick ~ imgs", imgs);
        Taro.previewImage({
            // 所有图片
            urls: imgs,
            // 当前图片
            current: img,
        });
    }
    const scrollToLower = () => {
        handleSearch(pageIndex, false);
    };
    const search = () => handleSearch(pageIndex, true);
    async function handleSearch(index, isNewSearch) {
        const params = {
            entryGroupNum: value,
            startDate: dateSel,
            endDate: dateSelEnd,
            pageNum: isNewSearch ? 1 : index,
            pageSize: 10,
        };
        const res = await axios.get(`${apiDomain}/scan`, {
            params,
            headers: {
                authorization: token,
            },
        });
        console.log("🚀 ~ file: index.jsx ~ line 58 ~ search ~ res", res);
        if (res?.data?.code === 0 && res?.data?.data?.list.length !== 0) {
            isNewSearch
                ? setData(res?.data?.data?.list)
                : setData((prev) => [...prev, ...res?.data?.data?.list]);
            isNewSearch ? setPageIndex(2) : setPageIndex((prev) => prev + 1);
        } else {
            Taro.showToast({
                title: "没有更多的数据了",
                icon: "error",
                duration: 1000,
            });
            if (isNewSearch) {
                setData(res?.data?.data?.list);
            }
        }
    }
    return (
        <View className="mine">
            <AtMessage />
            <AtForm>
                <View className="mine_date_start">
                    <Picker mode="date" onChange={onDateChange}>
                        <AtList>
                            <AtListItem
                                title="请选择开始日期"
                                extraText={dateSel}
                            />
                        </AtList>
                    </Picker>
                </View>
                <View className="mine_date_end">
                    <Picker mode="date" onChange={onDateChangeEnd}>
                        <AtList>
                            <AtListItem
                                title="请选择结束日期"
                                extraText={dateSelEnd}
                            />
                        </AtList>
                    </Picker>
                </View>
                <View>
                    <AtInput
                        name="entryGroupNum"
                        title="受试者编号"
                        type="text"
                        placeholder="受试者编号"
                        value={value}
                        onChange={handleChangeVal}
                    />
                </View>
                <View>
                    <Button onClick={search} className="mine_search_button">
                        搜索
                    </Button>
                </View>
                <ScrollView
                    scrollY
                    lowerThreshold={100}
                    onScrollToLower={scrollToLower}
                    style={{ height: "500px", marginTop: 10 }}
                    scrollWithAnimation
                >
                    {data &&
                        data.map((item, index) => {
                            return (
                                <View className="mine_item_con" key={index}>
                                    {/* <View>
                                        扫描的编号:
                                        <Text>{item?.scanItemId || ""}</Text>
                                    </View> */}
                                    {/* {item?.username && (
                                        <View>
                                            用户名:
                                            <Text>{item?.username || ""}</Text>
                                        </View>
                                    )} */}
                                    {item?.projectName && (
                                        <View>
                                            项目名称:
                                            <Text>
                                                {item?.projectName || ""}
                                            </Text>
                                        </View>
                                    )}
                                    {item?.phase && (
                                        <View>
                                            期数:
                                            <Text>{item?.phase || ""}</Text>
                                        </View>
                                    )}
                                    {item?.testeeName && (
                                        <View>
                                            姓名缩写:
                                            <Text>
                                                {item?.testeeName || ""}
                                            </Text>
                                        </View>
                                    )}
                                    {item?.scanTime && (
                                        <View>
                                            提交时间:
                                            <Text>{item?.scanTime || ""}</Text>
                                        </View>
                                    )}
                                    {item?.injectionDate && (
                                        <View>
                                            注射时间:
                                            <Text>
                                                {item?.injectionDate || ""}
                                            </Text>
                                        </View>
                                    )}
                                    {item?.photoDate && (
                                        <View>
                                            拍照时间:
                                            <Text>{item?.photoDate || ""}</Text>
                                        </View>
                                    )}
                                    <View>
                                        手臂类型:
                                        <Text>
                                            {item.handType === 0
                                                ? "未知"
                                                : item.handType === 1
                                                ? "左前臂"
                                                : "右前臂"}
                                        </Text>
                                    </View>
                                    {item?.entryGroupNum && (
                                        <View>
                                            受试者编号:
                                            <Text>
                                                {item?.entryGroupNum || ""}
                                            </Text>
                                        </View>
                                    )}
                                    {item?.drugNum && (
                                        <View>
                                            药物编号:
                                            <Text>{item?.drugNum || ""}</Text>
                                        </View>
                                    )}
                                    {item?.followUpPeriod && (
                                        <View>
                                            随访周期:
                                            <Text>
                                                {item?.followUpPeriod || ""}
                                            </Text>
                                        </View>
                                    )}
                                    {item?.testeeName && (
                                        <View>
                                            皮肤红晕横径:
                                            <Text>
                                                {
                                                    item?.skinBlushHorizontalDiameter
                                                }
                                            </Text>
                                        </View>
                                    )}
                                    {item?.testeeName && (
                                        <View>
                                            皮肤红晕纵径:
                                            <Text>
                                                {
                                                    item?.skinBlushVerticalDiameter
                                                }
                                            </Text>
                                        </View>
                                    )}
                                    {item?.testeeName && (
                                        <View>
                                            皮肤硬结横径:
                                            <Text>
                                                {
                                                    item?.skinCallusesHorizontalDiameter
                                                }
                                            </Text>
                                        </View>
                                    )}
                                    {item?.testeeName && (
                                        <View>
                                            皮肤硬结纵径:
                                            <Text>
                                                {
                                                    item?.skinCallusesVerticalDiameter
                                                }
                                            </Text>
                                        </View>
                                    )}
                                    <View className="mine_item_pics_con">
                                        {item?.pics instanceof Object &&
                                            item?.pics.map((item2, index2) => (
                                                <Image
                                                    className="mine_item_pics"
                                                    src={item2}
                                                    key={index2}
                                                    mode="widthFix"
                                                    lazyLoad={true}
                                                    onClick={() =>
                                                        imgClick(
                                                            item.pics,
                                                            item2
                                                        )
                                                    }
                                                />
                                            ))}
                                    </View>
                                </View>
                            );
                        })}
                </ScrollView>
            </AtForm>
        </View>
    );
}
