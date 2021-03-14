import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
	render() {
		return (
			<html lang="en">
				<Head>
					<meta charSet="utf-8" />
					<meta name="viewport" content="width=device-width, initial-scale=1" />
					<meta name="theme-color" content="#1F4069" />
					<link rel="manifest" href="static/manifest.json" />
					<link rel="icon" href="/static/logo.png" />
					<link
						rel="stylesheet"
						href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
					/>
					<link rel="stylesheet" href="/static/fonts/PoppinsVN/font.css" />
					<link
						rel="stylesheet"
						href="/static/lib/fontawesome-free-5.15.0-web/css/all.min.css"
					/>
					<link
						href="/static/lib/flag-icon-css/css/flag-icon.min.css"
						rel="stylesheet"
					/>
					<script src="/static/lib/jquery/dist/jquery.min.js"></script>
					<script src="/static/js/bootstrap.bundle.min.js"></script>
					<script src="/static/lib/feather-icons/dist/feather.min.js"></script>
					<script src="/static/lib/perfect-scrollbar/dist/perfect-scrollbar.min.js"></script>
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</html>
		);
	}
}

MyDocument.getInitialProps = async (ctx) => {
	// Resolution order
	//
	// On the server:
	// 1. app.getInitialProps
	// 2. page.getInitialProps
	// 3. document.getInitialProps
	// 4. app.render
	// 5. page.render
	// 6. document.render
	//
	// On the server with error:
	// 1. document.getInitialProps
	// 2. app.render
	// 3. page.render
	// 4. document.render
	//
	// On the client
	// 1. app.getInitialProps
	// 2. page.getInitialProps
	// 3. app.render
	// 4. page.render

	// Render app and page and get the context of the page with collected side effects.
	const originalRenderPage = ctx.renderPage;

	ctx.renderPage = () =>
		originalRenderPage({
			enhanceApp: (App) => (props) => <App {...props} />,
		});

	const initialProps = await Document.getInitialProps(ctx);

	return {
		...initialProps,
		// Styles fragment is rendered after the app and page rendering finish.
		styles: [
			<React.Fragment key="styles">{initialProps.styles}</React.Fragment>,
		],
	};
};

export default MyDocument;
