import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Upload, X } from 'lucide-react';
import { Button } from '../ui/button';
import { EnterpriseData } from '../EnterpriseCertificationPage';
import { useState } from 'react';

interface EnterpriseInfoFormProps {
  data: EnterpriseData;
  onChange: (data: EnterpriseData) => void;
}

const industries = [
  '美妆',
  '电商',
  '教育',
  '金融',
  '游戏',
  '旅游',
  '餐饮',
  '其他',
];

const countries = ['中国', '美国', '日本', '韩国', '其他'];
const provinces = ['广东省', '北京市', '上海市', '浙江省', '江苏省'];
const cities = ['广州市', '深圳市', '北京市', '上海市', '杭州市'];

export function EnterpriseInfoForm({ data, onChange }: EnterpriseInfoFormProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 验证文件类型
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        alert('仅支持 JPG/JPEG/PNG 格式');
        return;
      }
      // 验证文件大小（10MB）
      if (file.size > 10 * 1024 * 1024) {
        alert('文件大小不能超过 10MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        onChange({
          ...data,
          businessLicense: file,
          businessLicensePreview: e.target?.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFile = () => {
    onChange({
      ...data,
      businessLicense: null,
      businessLicensePreview: '',
    });
  };

  return (
    <div className="space-y-6">
      {/* 行业 */}
      <div className="space-y-2">
        <Label htmlFor="industry">
          行业 <span className="text-destructive">*</span>
        </Label>
        <Select value={data.industry} onValueChange={(value) => onChange({ ...data, industry: value })}>
          <SelectTrigger id="industry">
            <SelectValue placeholder="请选择您公司的行业" />
          </SelectTrigger>
          <SelectContent>
            {industries.map((industry) => (
              <SelectItem key={industry} value={industry}>
                {industry}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 营业执照附件 */}
      <div className="space-y-2">
        <Label>
          营业执照附件 <span className="text-destructive">*</span>
        </Label>
        {data.businessLicensePreview ? (
          <div className="relative">
            <img
              src={data.businessLicensePreview}
              alt="营业执照预览"
              className="w-full h-48 object-contain border border-border rounded-md"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={handleRemoveFile}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-border rounded-md p-6 text-center">
            <input
              type="file"
              id="businessLicense"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleFileChange}
              className="hidden"
            />
            <label htmlFor="businessLicense" className="cursor-pointer">
              <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-2">点击上传营业执照</p>
              <p className="text-xs text-muted-foreground">支持 JPG/JPEG/PNG，最大 10MB</p>
            </label>
          </div>
        )}
        <p className="text-xs text-muted-foreground">
          如重新上传营业执照,营业执照中的"公司名称"与"营业执照统一社会信用代码"需与下方的信息一致。仅支持图片格式:JPG/JPEG/PNG。附件大小上限为10M
        </p>
      </div>

      {/* 企业名称 */}
      <div className="space-y-2">
        <Label htmlFor="enterpriseName">
          企业名称 <span className="text-destructive">*</span>
        </Label>
        <Input
          id="enterpriseName"
          value={data.enterpriseName}
          onChange={(e) => onChange({ ...data, enterpriseName: e.target.value })}
          placeholder="请输入企业名称"
        />
        <p className="text-xs text-muted-foreground">企业名称必须与营业执照一致</p>
      </div>

      {/* 统一社会信用代码 */}
      <div className="space-y-2">
        <Label htmlFor="socialCreditCode">
          统一社会信用代码 <span className="text-destructive">*</span>
        </Label>
        <Input
          id="socialCreditCode"
          value={data.socialCreditCode}
          onChange={(e) => onChange({ ...data, socialCreditCode: e.target.value })}
          placeholder="请输入营业执照的统一社会信用代码"
        />
        <p className="text-xs text-muted-foreground">
          营业执照统一社会信用代码的大小写需要与营业执照一致
        </p>
      </div>

      {/* 企业地址 */}
      <div className="space-y-2">
        <Label>
          企业地址 <span className="text-destructive">*</span>
        </Label>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <Select value={data.country} onValueChange={(value) => onChange({ ...data, country: value })}>
            <SelectTrigger>
              <SelectValue placeholder="选择国家" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={data.province} onValueChange={(value) => onChange({ ...data, province: value })}>
            <SelectTrigger>
              <SelectValue placeholder="选择省份" />
            </SelectTrigger>
            <SelectContent>
              {provinces.map((province) => (
                <SelectItem key={province} value={province}>
                  {province}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={data.city} onValueChange={(value) => onChange({ ...data, city: value })}>
            <SelectTrigger>
              <SelectValue placeholder="选择城市" />
            </SelectTrigger>
            <SelectContent>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Textarea
          value={data.detailedAddress}
          onChange={(e) => onChange({ ...data, detailedAddress: e.target.value })}
          placeholder="请填写详细地址"
          rows={3}
        />
      </div>
    </div>
  );
}

