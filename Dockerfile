FROM node:19-alpine3.16
WORKDIR /add
ENV binance_Key="PdJFI1VxZoe8RUPj9HhpnZgME4ad6AdSb4v44Q7upiR0MsV4YyEhqBgrhKVO46pm"
ENV binance_Secret="kLqCYunLkF6uDEQHmfEjeC2AHq7oobumZrs5UWgUnmMMI9Rb8kDaE8SKtgNpLyeV"

COPY . .
RUN npm install
EXPOSE 8080
CMD ["npm","start"]