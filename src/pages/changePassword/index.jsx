import { View, Image, Button } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { AtForm, AtInput, AtMessage } from "taro-ui";
import { axios } from "taro-axios";
import sleep from "../../utils/sleep";
import { useState, useEffect } from "react";
import { apiWebDomain } from "../../../config/buildConfig";
import "./index.scss";

export default function Index() {
    const [passwordAgain, setPasswordAgain] = useState(null);
    const [password, setPassword] = useState(null);
    const [token, setToken] = useState("");
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
    function changePasswordAgain(val) {
        setPasswordAgain(val);
    }
    function changePassword(val) {
        setPassword(val);
    }
    async function submit() {
        if (passwordAgain && password) {
            if (passwordAgain !== password) {
                Taro.atMessage({
                    message: "两次输入密码不一致，请检查",
                    type: "error",
                });
                return;
            }
            console.log(`${apiWebDomain}/password`);
            const res = await axios.put(
                `${apiWebDomain}/password`,
                { newPassword: password, oldPassword: "scan123456" },
                {
                    withCredentials: false, // 跨域我们暂时 false
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        authorization: token,
                    },
                }
            );
            console.log("🚀 ~ file: index.jsx ~ line 29 ~ submit ~ res", res);
            if (res?.data?.code === 0) {
                Taro.atMessage({
                    message: "修改成功, 请重新登录",
                    type: "success",
                });
                await sleep(1000);
                Taro.reLaunch({
                    url: "/pages/index/index",
                });
            } else {
                Taro.atMessage({
                    message: res?.data?.msg || "网络有误，请稍后再试",
                    type: "error",
                });
            }
        }
    }
    return (
        <View className="index">
            <AtMessage />
            <Image
                src="https://16913851.s21i.faiusr.com/4/ABUIABAEGAAgvNDZiwYoyYD_DTDcAzhr.png"
                style="width:111px;height:27px"
            />
            <View className="header">修改密码</View>
            <AtForm onSubmit={submit}>
                <AtInput
                    name="password"
                    title="密码"
                    type="password"
                    placeholder="请输入密码"
                    value={password}
                    onChange={(val) => changePassword(val)}
                />
                <AtInput
                    name="passwordAgain"
                    title="再输入密码"
                    type="password"
                    placeholder="请再次输入密码"
                    value={passwordAgain}
                    onChange={(val) => changePasswordAgain(val)}
                />
                <Button
                    className={
                        passwordAgain && password
                            ? "submitButton"
                            : "submitButtonEmpty"
                    }
                    formType="submit"
                >
                    修改
                </Button>
            </AtForm>
        </View>
    );
}
