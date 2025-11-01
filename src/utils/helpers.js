export const getAddressString = async (addr) => {
  const { province, district, ward, address } = addr
  let res = await fetch(
    'https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province',
    {
      headers: { token: import.meta.env.VITE_GHN_TOKEN_API }
    }
  )
  let data = await res.json()
  const listProvinces = data.data

  res = await fetch(
    'https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district',
    {
      method: 'POST',
      headers: {
        token: import.meta.env.VITE_GHN_TOKEN_API,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        province_id: province
      })
    }
  )
  data = await res.json()
  const listDistrictsByProvince = data.data

  res = await fetch(
    'https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id',
    {
      method: 'POST',
      headers: {
        token: import.meta.env.VITE_GHN_TOKEN_API,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        district_id: district
      })
    }
  )
  data = await res.json()
  const listWardsByDistrict = data.data

  const provinceName = listProvinces.find(
    (p) => p.ProvinceID === province
  )?.ProvinceName
  const districtName = listDistrictsByProvince.find(
    (d) => d.DistrictID === district
  )?.DistrictName
  const wardName = listWardsByDistrict.find(
    (w) => w.WardCode === ward
  )?.WardName

  return `${address}, ${wardName}, ${districtName}, ${provinceName}`
}
