<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>Second Opinion</title>

        <!-- Fonts -->
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📝</text></svg>">
    </head>
    <body class="w-screen overflow-x-hidden font-sans antialiased">
        <div id="app" class="flex w-screen h-screen"></div>
    </body>
    @viteReactRefresh
    @vite('resources/js/app.tsx')
</html>
