import React from 'react';
import Answers from './answerOption.jsx'
import Question from './question.jsx'
import GradeAll from './submitall.jsx'
import createRandom from './helpers/createRandom.jsx';
import createTimer from './helpers/createTimer.jsx';

class Quiz extends React.Component {

		constructor(props) {
			super(props);
			this.handleGradeAllClick = this.handleGradeAllClick.bind(this);
			this.handleResetAllClick = this.handleResetAllClick.bind(this);
			this.handleCorrectAnswer = this.handleCorrectAnswer.bind(this);
			this.state = {
				isAllGraded: false,
				questionorder: [],
				numcorrect: 0,
				time: 0
			};
		};

		startTimer() {
			this.setState(prevState => ({
				time: prevState.time += 1
			}))
		}
		componentDidMount() {
			this.timer = setInterval(() => this.startTimer(), 1000) //1000ms=1second
		}
		handleGradeAllClick() {
			window.location.href = `#header${this.props.id}`
			clearInterval(this.timer);
			this.setState({
				isAllGraded: true
			});
		};
		handleCorrectAnswer() {
			this.setState(prevState => ({
				numcorrect: prevState.numcorrect + 1
			}));
		};
		handleResetAllClick() {
			window.location.href = `#header${this.props.id}`
			this.timer = setInterval(() => this.startTimer(), 1000)
			this.setState({
				isAllGraded: false,
				questionorder: [],
				numcorrect: 0,
				time: 0
			});
			for (const testanswersselected of document.querySelectorAll(`input[name$=test${this.props.id}]`)) {
				testanswersselected.checked = false;
			}
		}

		render() {
				var qa1 = [];
				let {
					data
				} = this.props
				let {
					numcorrect
				} = this.state
				let totalquestions = data.length
				let displaytimer = createTimer(this.state.time)
				let score = 0

				if (totalquestions > 0) {
					score = Math.round((numcorrect / totalquestions) * 100)
				}

				qa1.push(
          <h5 className = 'testheader' key = {this.props.id + 'timerresponse'}>
              Timer: {displaytimer}
          </h5>
				);


				qa1.push(
          <h5 className = 'testheader' key = {this.props.id}>
					     Score: {numcorrect}/{totalquestions} = {score}%
          </h5>
				);

				var lenquestions = Array.from(Array(this.props.data.length).keys())
				let shufflequestions = createRandom(lenquestions)

				for (var i2 = 0; i2 < data.length; i2++) {
					let tempj
					let tempkey = this.state.questionorder
					if (this.state.isAllGraded === false) {
						//shuffle order of answer options if its in not graded state
						let oldj = shufflequestions[i2];
						tempkey = tempkey.push(oldj)
						tempj = this.state.questionorder[i2]
					}
					if (this.state.isAllGraded !== false) {
						//dont change order of answer options if its in graded state
						tempj = tempkey[i2]
					}
					const allanswers =
						data[tempj].incorrectanswers ? data[tempj].incorrectanswers.concat(data[tempj].correctanswer) : [];
					var lenanswers = Array.from(Array(allanswers.length).keys())
					var shuffleanswers = createRandom(lenanswers)
					qa1.push(
            <Question
            data2 = {data}
						id = {tempj}
						key = {tempj}
						num = {i2}/>
          );
						qa1.push(
              <Answers
              graded = {this.state.isAllGraded}
							data1 = {data[tempj]}
							answers = {allanswers}
							shuffleanswers = {shuffleanswers}
							addpoints = {this.handleCorrectAnswer}
							name = {'question' + i2.toString() + 'test' + this.props.id}
							key = {'question' + i2.toString() + 'test' + this.props.id}/>
            );
						}

						return (
              <div>
                {qa1}
                <GradeAll
                  graded = {this.state.isAllGraded}
							    gradeallclick = {this.handleGradeAllClick}
							    resetallclick = {this.handleResetAllClick}
							    gradescore = {this.handleIsCorrect}/>
              </div>
						);
					}
				}

				export default Quiz;
