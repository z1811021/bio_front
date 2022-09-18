import { View, Text, Button, Image, Picker } from "@tarojs/components";
import Taro from "@tarojs/taro";
import * as dayjs from "dayjs";
import { axios } from "taro-axios";
import compact from "lodash/compact";
import {
    AtImagePicker,
    AtInput,
    AtMessage,
    AtList,
    AtListItem,
    AtForm,
} from "taro-ui";
import { Fragment, useState, useEffect } from "react";
import sleep from "../../utils/sleep";
import { apiDomain } from "../../../config/buildConfig";
import "./index.scss";

const OSS_URL = "https://coen-scan.oss-cn-chengdu.aliyuncs.com/scan/";
export default function Index() {
    const diameterArr = [
        "skinBlushHorizontalDiameter",
        "skinBlushVerticalDiameter",
        "skinCallusesHorizontalDiameter",
        "skinCallusesVerticalDiameter",
    ];
    const [order, setOrder] = useState("无红晕和硬结");
    const [files, setFiles] = useState([]);
    const [files2, setFiles2] = useState([]);
    const [token, setToken] = useState("");
    const [info, setInfo] = useState({});
    const [scanOrder, setScanOrder] = useState("");
    const [userId, setUserId] = useState("");
    const [isLoading, setLoading] = useState(false);
    const [selector, setSelector] = useState(["无红晕和硬结", "红晕或硬结"]);
    const [modify, setIsModify] = useState(false);
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
    function takePhoto() {
        // 只允许从相机扫码
        Taro.scanCode({
            onlyFromCamera: true,
            success: (res) => {
                setOrder(res.result);
            },
        });
    }
    function onChangeImage(val) {
        if (order === "无红晕和硬结") {
            if (val.length > 1) {
                Taro.atMessage({
                    message: "无红晕和硬结只能上传一张照片",
                    type: "warning",
                });
                return;
            }
        } else {
            if (val.length > 4) {
                Taro.atMessage({
                    message: "只能上传四张照片",
                    type: "warning",
                });
                return;
            }
        }
        setFiles(val);
        console.log(
            "🚀 ~ file: index.jsx ~ line 31 ~ onChangeImage ~ val",
            val
        );
    }
    function onChangeImage2(val) {
        if (val.length > 1) {
            Taro.atMessage({
                message: "只能上传一张照片",
                type: "warning",
            });
            return;
        }
        setFiles2(val);
        console.log(
            "🚀 ~ file: index.jsx ~ line 31 ~ onChangeImage ~ val",
            val
        );
    }
    function onImageClick(index, file) {
        Taro.previewImage({
            current: file.file.path, // 当前显示图片的http链接
            urls: [`${file.file.path}`], // 需要预览的图片http链接列表
        });
        console.log(
            "🚀 ~ file: index.jsx ~ line 29 ~ onChangeImage ~ val",
            index
        );
        console.log(
            "🚀 ~ file: index.jsx ~ line 25 ~ onImageClick ~ file",
            file
        );
    }
    function preview(index) {
        Taro.previewImage({
            current: files[index].url, // 当前显示图片的http链接
            urls: [`${files[index].url}`], // 需要预览的图片http链接列表
        });
    }
    function preview2(index) {
        Taro.previewImage({
            current: files2[index].url, // 当前显示图片的http链接
            urls: [`${files2[index].url}`], // 需要预览的图片http链接列表
        });
    }
    function onFail(mes) {
        console.log("🚀 ~ file: index.jsx ~ line 29 ~ onFail ~ mes", mes);
    }
    function backTest() {
        setIsModify(false);
        setInfo({});
    }
    async function submit() {
        let isContinue = true;
        let newObj = {};
        Object.entries(info).forEach((item) => {
            console.log(
                "🚀 ~ file: index.jsx ~ line 96 ~ Object.entries ~ item",
                item
            );
            // eslint-disable-next-line no-restricted-globals
            if (diameterArr.includes(item[0]) && isNaN(Number(item[1]))) {
                Taro.atMessage({
                    message: "请输入数字",
                    type: "error",
                });
                isContinue = false;
                return;
            } else if (diameterArr.includes(item[0])) {
                newObj[item[0]] = Number([item[1]]);
            }
        });
        if (isContinue) {
            const res = await axios.put(
                `${apiDomain}/scan/${scanOrder}`,
                Object.assign(
                    {},
                    info,
                    { handType: info.handType === "右手" ? 2 : 1 },
                    newObj
                ),
                {
                    withCredentials: false, // 跨域我们暂时 false
                    headers: {
                        authorization: token,
                    },
                }
            );
            console.log("🚀 ~ file: index.jsx ~ line 93 ~ submit ~ res", res);
            if (res?.data?.code === 0) {
                Taro.atMessage({
                    message: "提交成功",
                    type: "success",
                });
                await sleep(2000);
                Taro.reLaunch({
                    url: "/pages/home/index",
                });
            } else {
                Taro.atMessage({
                    message: "提交失败，请稍后重试",
                    type: "warning",
                });
            }
        }
    }
    function modifyTest() {
        setIsModify(true);
    }
    async function getInfo() {
        if (order && files.length > 0 && files2.length > 0) {
            if (order === "红晕或硬结" && files.length !== 4) {
                Taro.atMessage({
                    message: "请上传四张照片",
                    type: "warning",
                });
                return;
            }
            setLoading(true);
            const aliData = await getAliCloudInfo();
            // const  res = await uploadAliCloud(aliData, files, 0);
            let uploadTimeArr = files.map((item, index) => {
                return uploadAliCloud(aliData, files, index);
            });
            let uploadTimeArr2 = files2.map((item, index) => {
                return uploadAliCloud(aliData, files2, index);
            });
            const statusesPromise = Promise.allSettled(uploadTimeArr);
            const statuses = await statusesPromise;

            const submitImgArr = statuses.map((item) => {
                return item.status === "fulfilled" ? item.value : "";
            });

            const statusesPromise2 = Promise.allSettled(uploadTimeArr2);
            const statuses2 = await statusesPromise2;

            const submitImgArr2 = statuses2.map((item) => {
                return item.status === "fulfilled" ? item.value : "";
            });
            console.log(
                "🚀 ~ file: index.jsx ~ line 220 ~ submitImgArr2 ~ submitImgArr2",
                submitImgArr2
            );
            // submit info
            const res = await axios.post(
                `${apiDomain}/scan`,
                {
                    skinType: order === "无红晕和硬结" ? 1 : 2,
                    pics: compact(submitImgArr),
                    otherPic: compact(submitImgArr2)[0],
                },
                {
                    withCredentials: false, // 跨域我们暂时 false
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        authorization: token,
                    },
                }
            );
            if (res?.data?.code === 0) {
                setLoading(false);
                Taro.atMessage({
                    message: "保存成功",
                    type: "success",
                });
                setInfo(res?.data?.data || {});
                setScanOrder(res?.data?.data?.scanItemId || "");
                setUserId(res?.data?.data?.userId || "");
            } else {
                setLoading(false);
                Taro.atMessage({
                    message: res?.data?.msg || "请稍后再试",
                    type: "error",
                });
            }
        } else {
            Taro.atMessage({
                message: "请上传照片",
                type: "warn",
            });
        }
    }
    // get upload info para
    async function getAliCloudInfo() {
        const res = await axios.get(`${apiDomain}/policy`, {
            headers: {
                authorization: token,
            },
        });

        if (res?.data?.code === 0) {
            return res.data.data;
        } else {
            Taro.atMessage({
                message: "登录过期， 请重新登录",
                type: "warn",
            });
            await sleep(1500);
            Taro.reLaunch({
                url: "/pages/index/index",
            });
            return;
        }
    }
    // upload info Ali
    async function uploadAliCloud(aliData, pic, index) {
        console.log(
            "🚀 ~ file: index.jsx ~ line 152 ~ uploadAliCloud ~ aliData, files",
            aliData,
            pic
        );
        const { accessid, host, expire, signature, policy, dir, callback } =
            aliData;
        const OSSAccessKeyId = accessid;
        const success_action_status = "200";
        const imageName =
            Taro.getStorageSync("username") + Date.now() + index + "system.png";
        console.log(
            "🚀 ~ file: index.jsx ~ line 166 ~ uploadAliCloud ~ imageName",
            imageName
        );
        const key = dir + imageName;
        const obj = {
            key: key,
            expire: expire,

            callback: callback,
            policy: policy,
            OSSAccessKeyId: OSSAccessKeyId,
            success_action_status: success_action_status,
            signature: signature,
            // 'file': pic[index].file.path,
        };
        try {
            const uplaodRes = await Taro.uploadFile({
                url: host,
                filePath: pic[index].file.path,
                name: "file",
                formData: obj,
                success(res) {
                    return res;
                },
                fail(res) {},
            });
            if (JSON.parse(uplaodRes.data).code == 0) {
                return imageName;
            } else {
                throw new Error(400);
            }
        } catch (error) {
            throw new Error(400);
        }
    }
    function changeVal(e) {
        console.log("🚀 ~ file: index.jsx ~ line 98 ~ changeVal ~ val", e);
        setOrder(selector[e.detail.value]);
    }
    function changeForm(val, e) {
        console.log("🚀 ~ file: index.jsx ~ line 234 ~ changeForm ~ val", val);
        const key = e.mpEvent.target.id;
        setInfo(Object.assign({}, info, { [key]: val }));
    }
    function blurForm(val, e) {
        const key = e.mpEvent.target.id;
        if (key === "handType") {
            if (val !== "左手" && val !== "右手") {
                Taro.atMessage({
                    message: `手臂类型只能是 '左手' 或 '右手' `,
                    type: "error",
                });
            }
        }
        // eslint-disable-next-line no-restricted-globals
        if (diameterArr.includes(key) && isNaN(val)) {
            Taro.atMessage({
                message: `请输入数字`,
                type: "error",
            });
        }
    }
    function onDateChange(e) {
        console.log("🚀 ~ file: index.jsx ~ line 250 ~ onDateChange ~ e", e);
        const val = e.detail.value;
        setInfo(Object.assign({}, info, { injectionDate: val }));
    }
    return (
        <View className="add">
            <AtMessage />
            {Object.keys(info).length === 0 ? (
                <Fragment>
                    <View className="add_order">
                        <Picker
                            mode="selector"
                            range={selector}
                            onChange={(val) => changeVal(val)}
                        >
                            <AtList>
                                <AtListItem
                                    title="请选择症状"
                                    extraText={order}
                                />
                            </AtList>
                        </Picker>
                    </View>
                    <View className="add_order_name">
                        {order === "无红晕和硬结"
                            ? "请上传受试皮肤照片 (1 张)"
                            : "请上传受试皮肤照片 (4 张)"}
                    </View>
                    <AtImagePicker
                        length={4}
                        multiple
                        files={files}
                        onChange={(val) => onChangeImage(val)}
                        onFail={(mes) => onFail(mes)}
                        onImageClick={(index, file) =>
                            onImageClick(index, file)
                        }
                    />
                    <View className="add_order_name">
                        请上传检测结果数据 (1 张)
                    </View>
                    <AtImagePicker
                        length={4}
                        multiple
                        files={files2}
                        onChange={(val) => onChangeImage2(val)}
                        onFail={(mes) => onFail(mes)}
                        onImageClick={(index, file) =>
                            onImageClick(index, file)
                        }
                    />
                    <Button
                        className={
                            order && files.length > 0 && files2.length > 0
                                ? "add_submit"
                                : "add_submit_empty"
                        }
                        onClick={getInfo}
                        disabled={isLoading}
                        loading={isLoading}
                        style={isLoading ? { opacity: ".5" } : {}}
                    >
                        {isLoading ? "提交中..." : "提交"}
                    </Button>
                </Fragment>
            ) : (
                <View className="add_order_list">
                    <View className="add_order_list_title">
                        被试编号:
                        <Text className="add_order_list_title_num">
                            {scanOrder}
                        </Text>
                    </View>
                    <View className="add_order_list_title">
                        用户ID号:
                        <Text className="add_order_list_title_doctor">
                            {userId}
                        </Text>
                    </View>
                    <View className="add_order_list_space"></View>
                    {modify ? (
                        <View>
                            <AtForm>
                                <AtInput
                                    name="name"
                                    title="姓名编号"
                                    type="text"
                                    value={info.name}
                                    onChange={changeForm}
                                />
                                <AtInput
                                    name="handType"
                                    title="手臂类型"
                                    type="text"
                                    value={
                                        info.handType === 0
                                            ? "未知"
                                            : info.handType === 1
                                            ? "左手"
                                            : info.handType === 1
                                            ? "右手"
                                            : info.handType
                                    }
                                    onChange={changeForm}
                                    onBlur={blurForm}
                                />
                                <AtInput
                                    name="entryGroupNum"
                                    title="入组编号"
                                    type="text"
                                    value={info.entryGroupNum}
                                    onChange={changeForm}
                                />
                                <AtInput
                                    name="drugNum"
                                    title="药物编号"
                                    type="text"
                                    value={info.drugNum}
                                    onChange={changeForm}
                                />
                                <Picker mode="date" onChange={onDateChange}>
                                    <AtList>
                                        <AtListItem
                                            title="注射日期"
                                            extraText={info.injectionDate}
                                        />
                                    </AtList>
                                </Picker>
                                <AtInput
                                    name="followUpPeriod"
                                    title="随访周期"
                                    type="text"
                                    value={info.followUpPeriod}
                                    onChange={changeForm}
                                />
                            </AtForm>
                        </View>
                    ) : (
                        <View>
                            <View className="add_order_list_title">
                                姓名编号:
                                <Text className="add_order_list_title_doctor">
                                    {info.name}
                                </Text>
                            </View>
                            <View className="add_order_list_title">
                                手臂类型:
                                <Text className="add_order_list_title_doctor">
                                    {info.handType === 0
                                        ? "未知"
                                        : info.handType === 1
                                        ? "左手"
                                        : "右手"}
                                </Text>
                            </View>
                            <View className="add_order_list_title">
                                入组编号:
                                <Text className="add_order_list_title_doctor">
                                    {info.entryGroupNum}
                                </Text>
                            </View>
                            <View className="add_order_list_title">
                                药物编号:
                                <Text className="add_order_list_title_doctor">
                                    {info.drugNum}
                                </Text>
                            </View>
                            <View className="add_order_list_title">
                                注射日期:
                                <Text className="add_order_list_title_doctor">
                                    {info.injectionDate}
                                </Text>
                            </View>
                            <View className="add_order_list_title">
                                随访周期:
                                <Text className="add_order_list_title_doctor">
                                    {info.followUpPeriod}
                                </Text>
                            </View>
                        </View>
                    )}
                    {/* {order !== "无红晕和硬结" && modify && (
                        <AtForm>
                            <AtInput
                                name="skinBlushHorizontalDiameter"
                                title="皮肤红晕横径"
                                type="digit"
                                value={info.skinBlushHorizontalDiameter}
                                onChange={changeForm}
                                className="add_order_width"
                                onBlur={blurForm}
                            />
                            <AtInput
                                name="skinBlushVerticalDiameter"
                                title="皮肤红晕纵径"
                                type="digit"
                                value={info.skinBlushVerticalDiameter}
                                onChange={changeForm}
                                className="add_order_width"
                                onBlur={blurForm}
                            />
                            <AtInput
                                name="skinCallusesHorizontalDiameter"
                                title="皮肤硬结横径"
                                type="digit"
                                value={info.skinCallusesHorizontalDiameter}
                                onChange={changeForm}
                                className="add_order_width"
                                onBlur={blurForm}
                            />
                            <AtInput
                                name="skinCallusesVerticalDiameter"
                                title="皮肤硬结纵径"
                                type="digit"
                                value={info.skinCallusesVerticalDiameter}
                                onChange={changeForm}
                                className="add_order_width"
                                onBlur={blurForm}
                            />
                        </AtForm>
                    )}
                    {order !== "无红晕和硬结" && !modify && (
                        <>
                            <View className="add_order_list_space"></View>
                            <View className="add_order_list_title">
                                皮肤红晕横径:
                                <Text className="add_order_list_title_doctor">
                                    {info.skinBlushHorizontalDiameter}
                                </Text>
                            </View>
                            <View className="add_order_list_title">
                                皮肤红晕纵径:
                                <Text className="add_order_list_title_doctor">
                                    {info.skinBlushVerticalDiameter}
                                </Text>
                            </View>
                            <View className="add_order_list_title">
                                皮肤硬结横径:
                                <Text className="add_order_list_title_doctor">
                                    {info.skinCallusesHorizontalDiameter}
                                </Text>
                            </View>
                            <View className="add_order_list_title">
                                皮肤硬结纵径:
                                <Text className="add_order_list_title_doctor">
                                    {info.skinCallusesVerticalDiameter}
                                </Text>
                            </View>
                        </>
                    )} */}
                    {files.map((item, index) => {
                        return (
                            <Image
                                key={index}
                                onClick={() => preview(index)}
                                src={item.url}
                                style={{
                                    width: "138px",
                                    height: "123px",
                                    margin: "10px",
                                }}
                            />
                        );
                    })}
                    {files2.map((item, index) => {
                        return (
                            <Image
                                key={index}
                                onClick={() => preview2(index)}
                                src={item.url}
                                style={{
                                    width: "138px",
                                    height: "123px",
                                    margin: "10px",
                                }}
                            />
                        );
                    })}
                    <View className="add_order_list_button">
                        <Button
                            className="add_order_list_button_back"
                            onClick={backTest}
                        >
                            返回重测
                        </Button>
                        {!modify && (
                            <Button
                                className="add_order_list_button_modify"
                                onClick={modifyTest}
                            >
                                修改
                            </Button>
                        )}
                        <Button
                            className="add_order_list_button_submit"
                            onClick={submit}
                        >
                            确认
                        </Button>
                    </View>
                    <View className="add_order_list_space_height"></View>
                </View>
            )}
        </View>
    );
}
