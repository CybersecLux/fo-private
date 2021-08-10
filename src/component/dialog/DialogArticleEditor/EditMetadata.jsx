import React from "react";
import "./EditContent.css";
import FormLine from "../../form/FormLine.jsx";
import { validateUrlHandle } from "../../../utils/re.jsx";

export default class EditContent extends React.Component {
	constructor(props) {
		super(props);

		this.getStatusOptions = this.getStatusOptions.bind(this);
		this.changeState = this.changeState.bind(this);

		this.state = {
			content: null,
			originalContent: null,
		};
	}

	getAvailableArticleType() {
		if (this.props.articleEnums !== null
			&& this.props.articleEnums.type !== undefined
			&& this.props.settings !== null
			&& this.props.settings.AUTHORIZED_ARTICLE_TYPES_FOR_ECOSYSTEM !== undefined) {
			return this.props.settings.AUTHORIZED_ARTICLE_TYPES_FOR_ECOSYSTEM
				.split(",")
				.filter((t) => this.props.articleEnums.type.indexOf(t) >= 0);
		}

		return [];
	}

	getStatusOptions() {
		if (this.props.articleEnums === null
			|| this.props.articleEnums.status === undefined
			|| this.props.settings === null) {
			return [];
		}

		if (this.props.settings.DEACTIVATE_REVIEW_ON_ECOSYSTEM_ARTICLE === "TRUE") {
			return this.props.articleEnums.status
				.filter((o) => o !== "UNDER REVIEW")
				.map((o) => ({ label: o, value: o }));
		}

		return this.props.articleEnums.status
			.filter((o) => o !== "PUBLIC")
			.map((o) => ({ label: o, value: o }));
	}

	changeState(field, value) {
		this.setState({ [field]: value });
	}

	render() {
		return (
			<div className="row">
				<div className="col-md-12">
					<div className={"row row-spaced"}>
						<div className="col-md-12">
							<h3>Metadata</h3>
						</div>

						<div className="col-md-12">
							<FormLine
								label={"Title"}
								value={this.props.article.title}
								onBlur={(v) => this.props.saveArticleValue("title", v)}
							/>
							<FormLine
								label={"Type"}
								type={"select"}
								value={this.props.article.type}
								options={this.getAvailableArticleType().map((o) => ({ label: o, value: o }))}
								onChange={(v) => this.props.saveArticleValue("type", v)}
							/>
							<FormLine
								label={"Handle"}
								value={this.props.article.handle}
								onBlur={(v) => this.props.saveArticleValue("handle", v)}
								format={validateUrlHandle}
							/>
							<FormLine
								type="editor"
								label={"Abstract"}
								value={this.props.article.abstract}
								onBlur={(v) => this.props.saveArticleValue("abstract", v)}
							/>
							<FormLine
								type={"date"}
								label={"Publication date"}
								value={this.props.article.publication_date}
								onBlur={(v) => this.props.saveArticleValue("publication_date", v)}
							/>
							<FormLine
								label={"Status"}
								type={"select"}
								value={this.props.article.status}
								options={this.getStatusOptions()}
								onChange={(v) => this.props.saveArticleValue("status", v)}
							/>
						</div>

						{["EVENT"].indexOf(this.props.article.type) >= 0
							&& <div className="col-md-12">
								<h2>Additional {this.props.article.type.toLowerCase()} fields</h2>
							</div>}

						{this.props.article.type === "EVENT"
							&& <div className="col-md-12">
								<FormLine
									label={"Start date"}
									type={"datetime"}
									value={this.props.article.start_date}
									onBlur={(v) => this.props.saveArticleValue("start_date", v === null ? v : v.format("yyyy-MM-DDTHH:mm"))}
								/>
								<FormLine
									label={"End date"}
									type={"datetime"}
									value={this.props.article.end_date}
									onBlur={(v) => this.props.saveArticleValue("end_date", v === null ? v : v.format("yyyy-MM-DDTHH:mm"))}
								/>
							</div>}
					</div>
				</div>
			</div>
		);
	}
}