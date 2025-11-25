import { Check, X, Info } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import { getRoleDisplayName } from '../lib/permissionUtils';

const permissions = [
  { feature: '邀请成员', owner: true, admin: true, finance: false, member: false, note: '管理员不能邀请项目负责人角色' },
  { feature: '分配/修改成员角色', owner: true, admin: true, finance: false, member: false, note: '管理员不能分配项目负责人角色' },
  { feature: '分配广告账户', owner: true, admin: true, finance: false, member: false, note: '成员角色仅能操作被分配的账户' },
  { feature: '转移/交接项目负责人', owner: true, admin: false, finance: false, member: false, note: '' },
  { feature: '管理广告账户', owner: true, admin: true, finance: false, member: false, note: '管理员/成员基于被授权的账户' },
  { feature: '发起充值 / 使用钱包', owner: true, admin: true, finance: true, member: false, note: '管理员/财务基于授权的钱包' },
  { feature: '查看钱包余额/流水', owner: true, admin: true, finance: true, member: false, note: '管理员/财务基于授权的钱包' },
  { feature: '查看广告数据', owner: true, admin: true, finance: true, member: true, note: '财务仅查看消费类数据；成员仅看被分配账户数据' },
  { feature: '编辑广告内容 / 发起投放', owner: true, admin: true, finance: false, member: true, note: '基于账户授权' },
  { feature: '查看账单 / 下载发票', owner: true, admin: true, finance: true, member: true, note: '成员受限' },
  { feature: '管理权限配置', owner: true, admin: false, finance: false, member: false, note: '' },
  { feature: '审计日志查看', owner: true, admin: true, finance: true, member: true, note: '基于自身权限范围查看日志' },
];

const PermissionIcon = ({ granted }: { granted: boolean }) => {
  return granted ? (
    <div className="flex justify-center">
      <Check className="w-5 h-5 text-emerald-600" />
    </div>
  ) : (
    <div className="flex justify-center">
      <X className="w-5 h-5 text-muted-foreground/30" />
    </div>
  );
};

export function PermissionMatrix() {
  return (
    <div>
      <h3 className="text-foreground mb-5">权限矩阵</h3>
      <div className="border border-border rounded-lg overflow-hidden">
        <TooltipProvider>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-1/3">功能 / 权限项</TableHead>
                <TableHead className="text-center w-1/6">{getRoleDisplayName('Owner')}</TableHead>
                <TableHead className="text-center w-1/6">{getRoleDisplayName('Admin')}</TableHead>
                <TableHead className="text-center w-1/6">{getRoleDisplayName('Finance')}</TableHead>
                <TableHead className="text-center w-1/6">{getRoleDisplayName('Member')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {permissions.map((permission, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-foreground">{permission.feature}</span>
                      {permission.note && (
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="w-4 h-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p>{permission.note}</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <PermissionIcon granted={permission.owner} />
                  </TableCell>
                  <TableCell>
                    <PermissionIcon granted={permission.admin} />
                  </TableCell>
                  <TableCell>
                    <PermissionIcon granted={permission.finance} />
                  </TableCell>
                  <TableCell>
                    <PermissionIcon granted={permission.member} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TooltipProvider>
      </div>
    </div>
  );
}