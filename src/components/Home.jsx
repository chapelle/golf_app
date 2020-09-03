import React from 'react';
import './Common.css';
import "semantic-ui-css/semantic.min.css";
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker, { registerLocale } from 'react-datepicker';
import addDays from 'date-fns/addDays';
import ja from 'date-fns/locale/ja';
import format from 'date-fns/format';
import axios from 'axios';
import Result from './Result';
import Loading from './Loading';



const Today = new Date();
registerLocale('ja', ja);

class Home extends React.Component {
    state = { 
                date: addDays(new Date(), 14), 
                budget: '12000', 
                depature: '1', 
                duration: '90', 
                plans: [],
                planCount: 1,
                error: null,
                loading: false
    }

    onFormSubmit = async event => {
        try {

            event.preventDefault();
            this.setState({ loading: true });

            const response = await axios.get(
                "https://8g202aiby2.execute-api.ap-northeast-1.amazonaws.com/production",
                {
                    params: {
                        date: format(this.state.date, 'yyyyMMdd'),
                        budget: this.state.budget,
                        depature: this.state.depature,
                        duration: this.state.duration
                    }
                }
            );
            this.setState({
                planCount: response.data.count,
                plans: response.data.plans,
                loading: false
            });
        } catch (e) {
            this.setState({ error: e });
        }
    };

    render() {
        console.log(this.state);
        return (
            <div className="ui container" id="container">
                <div className="search_form">
                    <form className="ui form segment" onSubmit={this.onFormSubmit}>
                        <div className="field">
                            <label>
                                <i className="calendar alternate outline icon"></i>プレー日
                            </label>
                            <DatePicker
                                dateFormat='yyyy/MM/dd'
                                locale='ja'
                                selected={this.state.date}
                                onChange={e => this.setState({ date: e })}
                                minDate={Today}
                            />
                        </div>
                        <div className="field">
                            <label>
                                <i className="yen sign icon"></i>上限金額
                            </label>
                            <select 
                                className="ui dropdown" 
                                name="dropdown" 
                                value={this.state.budget} 
                                onChange={e => this.setState({ budget: e.target.value })}>
                                <option value="8000">8,000円</option>
                                <option value="12000">12,000円</option>
                                <option value="16000">16,000円</option>
                            </select>
                        </div>
                        <div className="field">
                            <label>
                                <i className="map pin icon"></i>移動時間計算の出発地点（自宅から近い地点をお選びください）
                            </label>
                            <select 
                                className="ui dropdown" 
                                name="dropdown" 
                                value={this.state.depature} 
                                onChange={e => this.setState({ depature: e.target.value })}>
                                <option value="1">東京駅</option>
                                <option value="2">横浜駅</option>
                                <option value="3">蒲田駅</option>
                            </select>
                        </div>
                        <div className="field">
                            <label>
                                <i className="car icon"></i>車での移動時間の上限
                            </label>
                            <select 
                                className="ui dropdown" 
                                name="dropdown" 
                                value={this.state.duration} 
                                onChange={e => this.setState({ duration: e.target.value })}>
                                <option value="60">60分</option>
                                <option value="90">90分</option>
                                <option value="120">120分</option>
                            </select>
                        </div>
                        <div className="search_button">
                            <button type="submit" className="search_button_design">
                                <i className="search icon"></i>ゴルフ場を検索
                            </button>
                        </div>
                    </form>

                    <Loading loading={this.state.loading}/>

                    <Result 
                        plans={this.state.plans}
                        planCount={this.state.planCount}
                        error={this.state.error}
                    />
                </div>
            </div>
        );
    }
}

export default Home;